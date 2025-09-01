-- Criar tabela workout_plans para planos de treino criados pelo admin
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  observations TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela admin_configs para configurações de admin
CREATE TABLE IF NOT EXISTS public.admin_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela workout_sessions para histórico de treinos
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration INTEGER, -- duração em minutos
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela workout_sets para séries de exercícios
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL, -- ID do exercício (referência local)
  weight DECIMAL(5,2) NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir admin padrão (yaraka78@gmail.com)
INSERT INTO public.admin_configs (admin_email) 
VALUES ('yaraka78@gmail.com')
ON CONFLICT (admin_email) DO NOTHING;

-- Habilitar RLS nas tabelas
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para workout_plans
CREATE POLICY "Users can view their own workout plans" 
ON public.workout_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all workout plans" 
ON public.workout_plans 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

CREATE POLICY "Admins can insert workout plans" 
ON public.workout_plans 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

CREATE POLICY "Admins can update their created workout plans" 
ON public.workout_plans 
FOR UPDATE 
USING (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

CREATE POLICY "Admins can delete their created workout plans" 
ON public.workout_plans 
FOR DELETE 
USING (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

-- Políticas RLS para admin_configs
CREATE POLICY "Admins can view admin configs" 
ON public.admin_configs 
FOR SELECT 
USING (
  admin_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

-- Políticas RLS para workout_sessions
CREATE POLICY "Users can view their own workout sessions" 
ON public.workout_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout sessions" 
ON public.workout_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout sessions" 
ON public.workout_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout sessions" 
ON public.workout_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas RLS para workout_sets
CREATE POLICY "Users can view sets from their own sessions" 
ON public.workout_sets 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_sessions ws 
    WHERE ws.id = workout_sets.session_id AND ws.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert sets in their own sessions" 
ON public.workout_sets 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workout_sessions ws 
    WHERE ws.id = workout_sets.session_id AND ws.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update sets from their own sessions" 
ON public.workout_sets 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_sessions ws 
    WHERE ws.id = workout_sets.session_id AND ws.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete sets from their own sessions" 
ON public.workout_sets 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_sessions ws 
    WHERE ws.id = workout_sets.session_id AND ws.user_id = auth.uid()
  )
);

-- Triggers para timestamps automáticos
CREATE TRIGGER update_workout_plans_updated_at
  BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_configs_updated_at
  BEFORE UPDATE ON public.admin_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  check_email TEXT;
BEGIN
  check_email := COALESCE(
    user_email,
    (SELECT email FROM auth.users WHERE id = auth.uid())
  );
  
  RETURN EXISTS (
    SELECT 1 FROM public.admin_configs 
    WHERE admin_email = check_email AND is_active = true
  );
END;
$$;

-- Função para pegar planos de treino de um usuário
CREATE OR REPLACE FUNCTION public.get_user_workout_plans(target_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  exercises JSONB,
  observations TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wp.id,
    wp.name,
    wp.exercises,
    wp.observations,
    wp.created_by,
    wp.created_at,
    wp.updated_at
  FROM public.workout_plans wp
  WHERE wp.user_id = target_user_id
  ORDER BY wp.created_at DESC;
END;
$$;
