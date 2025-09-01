-- ========================================
-- YARA MOTIVATION - TABELAS SUPABASE
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- https://supabase.com/dashboard/project/gqpikdwbuxnxifgekwqr/sql
-- ========================================

-- 1. Criar tabela workout_plans para planos de treino criados pelo admin
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

-- 2. Criar tabela admin_configs para configurações de admin
CREATE TABLE IF NOT EXISTS public.admin_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Criar tabela workout_sessions para histórico de treinos
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration INTEGER, -- duração em minutos
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Criar tabela workout_sets para séries de exercícios
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL, -- ID do exercício (referência local)
  weight DECIMAL(5,2) NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Inserir admin padrão (yaraka78@gmail.com)
INSERT INTO public.admin_configs (admin_email) 
VALUES ('yaraka78@gmail.com')
ON CONFLICT (admin_email) DO NOTHING;

-- ========================================
-- CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ========================================

-- 6. Habilitar RLS nas tabelas
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- ========================================
-- POLÍTICAS DE SEGURANÇA - WORKOUT_PLANS
-- ========================================

-- 7. Usuários podem ver seus próprios planos de treino
DROP POLICY IF EXISTS "Users can view their own workout plans" ON public.workout_plans;
CREATE POLICY "Users can view their own workout plans" 
ON public.workout_plans 
FOR SELECT 
USING (auth.uid() = user_id);

-- 8. Admins podem ver todos os planos
DROP POLICY IF EXISTS "Admins can view all workout plans" ON public.workout_plans;
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

-- 9. Admins podem inserir planos para qualquer usuário
DROP POLICY IF EXISTS "Admins can insert workout plans" ON public.workout_plans;
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

-- 10. Admins podem atualizar planos que criaram
DROP POLICY IF EXISTS "Admins can update their created workout plans" ON public.workout_plans;
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

-- 11. Admins podem deletar planos que criaram
DROP POLICY IF EXISTS "Admins can delete their created workout plans" ON public.workout_plans;
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

-- ========================================
-- POLÍTICAS DE SEGURANÇA - ADMIN_CONFIGS
-- ========================================

-- 12. Apenas admins podem ver configurações de admin
DROP POLICY IF EXISTS "Admins can view admin configs" ON public.admin_configs;
CREATE POLICY "Admins can view admin configs" 
ON public.admin_configs 
FOR SELECT 
USING (
  admin_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

-- ========================================
-- POLÍTICAS DE SEGURANÇA - WORKOUT_SESSIONS
-- ========================================

-- 13. Usuários podem ver apenas suas próprias sessões de treino
DROP POLICY IF EXISTS "Users can view their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can view their own workout sessions" 
ON public.workout_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

-- 14. Usuários podem inserir suas próprias sessões
DROP POLICY IF EXISTS "Users can insert their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can insert their own workout sessions" 
ON public.workout_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 15. Usuários podem atualizar suas próprias sessões
DROP POLICY IF EXISTS "Users can update their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can update their own workout sessions" 
ON public.workout_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 16. Usuários podem deletar suas próprias sessões
DROP POLICY IF EXISTS "Users can delete their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can delete their own workout sessions" 
ON public.workout_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- ========================================
-- POLÍTICAS DE SEGURANÇA - WORKOUT_SETS
-- ========================================

-- 17. Usuários podem ver sets de suas próprias sessões
DROP POLICY IF EXISTS "Users can view sets from their own sessions" ON public.workout_sets;
CREATE POLICY "Users can view sets from their own sessions" 
ON public.workout_sets 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_sessions ws 
    WHERE ws.id = workout_sets.session_id AND ws.user_id = auth.uid()
  )
);

-- 18. Usuários podem inserir sets em suas próprias sessões
DROP POLICY IF EXISTS "Users can insert sets in their own sessions" ON public.workout_sets;
CREATE POLICY "Users can insert sets in their own sessions" 
ON public.workout_sets 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workout_sessions ws 
    WHERE ws.id = workout_sets.session_id AND ws.user_id = auth.uid()
  )
);

-- 19. Usuários podem atualizar sets de suas próprias sessões
DROP POLICY IF EXISTS "Users can update sets from their own sessions" ON public.workout_sets;
CREATE POLICY "Users can update sets from their own sessions" 
ON public.workout_sets 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_sessions ws 
    WHERE ws.id = workout_sets.session_id AND ws.user_id = auth.uid()
  )
);

-- 20. Usuários podem deletar sets de suas próprias sessões
DROP POLICY IF EXISTS "Users can delete sets from their own sessions" ON public.workout_sets;
CREATE POLICY "Users can delete sets from their own sessions" 
ON public.workout_sets 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_sessions ws 
    WHERE ws.id = workout_sets.session_id AND ws.user_id = auth.uid()
  )
);

-- ========================================
-- TRIGGERS PARA TIMESTAMPS AUTOMÁTICOS
-- ========================================

-- 21. Trigger para workout_plans
DROP TRIGGER IF EXISTS update_workout_plans_updated_at ON public.workout_plans;
CREATE TRIGGER update_workout_plans_updated_at
  BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 22. Trigger para admin_configs
DROP TRIGGER IF EXISTS update_admin_configs_updated_at ON public.admin_configs;
CREATE TRIGGER update_admin_configs_updated_at
  BEFORE UPDATE ON public.admin_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- FUNÇÕES UTILITÁRIAS
-- ========================================

-- 23. Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  check_email TEXT;
BEGIN
  -- Usar email fornecido ou pegar email do usuário atual
  check_email := COALESCE(
    user_email,
    (SELECT email FROM auth.users WHERE id = auth.uid())
  );
  
  -- Verificar se email existe em admin_configs e está ativo
  RETURN EXISTS (
    SELECT 1 FROM public.admin_configs 
    WHERE admin_email = check_email AND is_active = true
  );
END;
$$;

-- 24. Função para pegar planos de treino de um usuário
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

-- ========================================
-- ATUALIZAR TIPOS TYPESCRIPT (OPCIONAL)
-- ========================================

-- 25. Comentário para gerar tipos TypeScript
-- Execute: npx supabase gen types typescript --project-id gqpikdwbuxnxifgekwqr > src/integrations/supabase/types.ts

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- 26. Verificar se tudo foi criado corretamente
DO $$
BEGIN
  -- Verificar tabelas
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workout_plans') THEN
    RAISE EXCEPTION 'Tabela workout_plans não foi criada!';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_configs') THEN
    RAISE EXCEPTION 'Tabela admin_configs não foi criada!';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workout_sessions') THEN
    RAISE EXCEPTION 'Tabela workout_sessions não foi criada!';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'workout_sets') THEN
    RAISE EXCEPTION 'Tabela workout_sets não foi criada!';
  END IF;
  
  -- Verificar admin
  IF NOT EXISTS (SELECT FROM public.admin_configs WHERE admin_email = 'yaraka78@gmail.com') THEN
    RAISE EXCEPTION 'Admin yaraka78@gmail.com não foi inserido!';
  END IF;
  
  RAISE NOTICE '✅ Todas as tabelas foram criadas com sucesso!';
  RAISE NOTICE '✅ Admin yaraka78@gmail.com configurado!';
  RAISE NOTICE '✅ Políticas RLS aplicadas!';
  RAISE NOTICE '✅ Triggers configurados!';
  RAISE NOTICE '✅ Yara motivation está pronto para usar o Supabase! 🚀';
END $$;
