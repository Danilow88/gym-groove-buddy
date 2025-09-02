-- Adicionar suporte a dias da semana para planos de treino
-- Permitir que admin crie treinos específicos por dia da semana

-- 1. Adicionar colunas para dias da semana na tabela workout_plans
ALTER TABLE public.workout_plans 
ADD COLUMN IF NOT EXISTS days_of_week TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_weekly_plan BOOLEAN DEFAULT false;

-- 2. Criar tabela para exercícios detalhados por dia da semana
CREATE TABLE IF NOT EXISTS public.weekly_workout_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  day_name TEXT NOT NULL CHECK (day_name IN ('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo')),
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  is_rest_day BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workout_plan_id, day_of_week)
);

-- 3. Enable RLS na nova tabela
ALTER TABLE public.weekly_workout_details ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS para weekly_workout_details
CREATE POLICY "Users can view workout details from their plans"
ON public.weekly_workout_details
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans wp 
    WHERE wp.id = workout_plan_id AND wp.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all workout details"
ON public.weekly_workout_details
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

CREATE POLICY "Admins can insert workout details"
ON public.weekly_workout_details
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

CREATE POLICY "Admins can update workout details"
ON public.weekly_workout_details
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans wp
    WHERE wp.id = workout_plan_id AND wp.created_by = auth.uid()
  ) AND
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

CREATE POLICY "Admins can delete workout details"
ON public.weekly_workout_details
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans wp
    WHERE wp.id = workout_plan_id AND wp.created_by = auth.uid()
  ) AND
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

-- 5. Trigger para timestamps automáticos
CREATE TRIGGER update_weekly_workout_details_updated_at
  BEFORE UPDATE ON public.weekly_workout_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Função para pegar plano semanal completo do usuário
CREATE OR REPLACE FUNCTION public.get_user_weekly_plan(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  plan_id UUID,
  plan_name TEXT,
  plan_observations TEXT,
  day_of_week TEXT,
  day_name TEXT,
  exercises JSONB,
  notes TEXT,
  is_rest_day BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wp.id as plan_id,
    wp.name as plan_name,
    wp.observations as plan_observations,
    wwd.day_of_week,
    wwd.day_name,
    wwd.exercises,
    wwd.notes,
    wwd.is_rest_day
  FROM public.workout_plans wp
  LEFT JOIN public.weekly_workout_details wwd ON wp.id = wwd.workout_plan_id
  WHERE wp.user_id = get_user_weekly_plan.user_id 
    AND wp.is_weekly_plan = true
  ORDER BY 
    wp.created_at DESC,
    CASE wwd.day_of_week
      WHEN 'monday' THEN 1
      WHEN 'tuesday' THEN 2
      WHEN 'wednesday' THEN 3
      WHEN 'thursday' THEN 4
      WHEN 'friday' THEN 5
      WHEN 'saturday' THEN 6
      WHEN 'sunday' THEN 7
    END;
END;
$$;

-- 7. Função para obter treino do dia atual
CREATE OR REPLACE FUNCTION public.get_today_workout(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
  plan_name TEXT,
  exercises JSONB,
  notes TEXT,
  is_rest_day BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  today_name TEXT;
BEGIN
  -- Obter dia da semana atual em inglês
  SELECT CASE EXTRACT(DOW FROM CURRENT_DATE)
    WHEN 0 THEN 'sunday'
    WHEN 1 THEN 'monday'
    WHEN 2 THEN 'tuesday'
    WHEN 3 THEN 'wednesday'
    WHEN 4 THEN 'thursday'
    WHEN 5 THEN 'friday'
    WHEN 6 THEN 'saturday'
  END INTO today_name;

  RETURN QUERY
  SELECT 
    wp.name as plan_name,
    COALESCE(wwd.exercises, '[]'::jsonb) as exercises,
    wwd.notes,
    COALESCE(wwd.is_rest_day, false) as is_rest_day
  FROM public.workout_plans wp
  LEFT JOIN public.weekly_workout_details wwd ON wp.id = wwd.workout_plan_id AND wwd.day_of_week = today_name
  WHERE wp.user_id = get_today_workout.user_id 
    AND wp.is_weekly_plan = true
  ORDER BY wp.created_at DESC
  LIMIT 1;
END;
$$;

-- 8. Função para criar plano semanal completo (para admin)
CREATE OR REPLACE FUNCTION public.create_weekly_workout_plan(
  target_user_id UUID,
  plan_name TEXT,
  plan_observations TEXT DEFAULT NULL,
  weekly_schedule JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_plan_id UUID;
  day_data JSONB;
  day_key TEXT;
BEGIN
  -- Verificar se usuário é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem criar planos semanais';
  END IF;

  -- Criar plano principal
  INSERT INTO public.workout_plans (user_id, name, observations, created_by, is_weekly_plan)
  VALUES (target_user_id, plan_name, plan_observations, auth.uid(), true)
  RETURNING id INTO new_plan_id;

  -- Adicionar detalhes para cada dia da semana
  FOR day_key IN SELECT jsonb_object_keys(weekly_schedule) LOOP
    day_data := weekly_schedule->day_key;
    
    INSERT INTO public.weekly_workout_details (
      workout_plan_id,
      day_of_week,
      day_name,
      exercises,
      notes,
      is_rest_day
    ) VALUES (
      new_plan_id,
      day_key,
      CASE day_key
        WHEN 'monday' THEN 'Segunda'
        WHEN 'tuesday' THEN 'Terça'
        WHEN 'wednesday' THEN 'Quarta'
        WHEN 'thursday' THEN 'Quinta'
        WHEN 'friday' THEN 'Sexta'
        WHEN 'saturday' THEN 'Sábado'
        WHEN 'sunday' THEN 'Domingo'
      END,
      COALESCE(day_data->'exercises', '[]'::jsonb),
      day_data->>'notes',
      COALESCE((day_data->>'is_rest_day')::boolean, false)
    ) ON CONFLICT (workout_plan_id, day_of_week) DO UPDATE SET
      exercises = EXCLUDED.exercises,
      notes = EXCLUDED.notes,
      is_rest_day = EXCLUDED.is_rest_day,
      updated_at = now();
  END LOOP;

  RETURN new_plan_id;
END;
$$;

-- 9. Grants de permissão
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.weekly_workout_details TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_weekly_plan TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_today_workout TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.create_weekly_workout_plan TO authenticated;
