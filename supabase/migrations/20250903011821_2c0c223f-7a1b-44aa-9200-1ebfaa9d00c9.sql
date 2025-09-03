-- Drop existing policies and recreate them correctly
DROP POLICY IF EXISTS "Admins can delete appointments" ON public.appointments;

-- Policy para que qualquer admin possa deletar appointments
CREATE POLICY "Admins can delete appointments" 
ON public.appointments 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

-- Melhorar política de visualização para admin ver todos os appointments
DROP POLICY IF EXISTS "Anyone can view available appointments" ON public.appointments;

CREATE POLICY "Users can view their appointments and admins see all" 
ON public.appointments 
FOR SELECT 
USING (
  status = 'available' OR 
  auth.uid() = user_id OR 
  auth.uid() = admin_id OR
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

-- Permitir qualquer usuário propor horários (será disponível para admin ver)
DROP POLICY IF EXISTS "Admins can create appointments" ON public.appointments;

CREATE POLICY "Users and admins can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (
    auth.uid() = admin_id OR 
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.admin_configs ac 
      WHERE ac.admin_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      ) AND ac.is_active = true
    )
  )
);