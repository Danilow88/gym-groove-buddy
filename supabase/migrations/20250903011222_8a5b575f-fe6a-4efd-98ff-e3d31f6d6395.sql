-- Primeiro, vamos criar a tabela de appointments se não existir
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  user_id UUID NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled')),
  meeting_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policies for appointments
DROP POLICY IF EXISTS "Anyone can view available appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can view all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can book available appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can update their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can cancel their appointments" ON public.appointments;

-- Anyone can view available appointments
CREATE POLICY "Anyone can view available appointments" 
ON public.appointments 
FOR SELECT 
USING (status = 'available' OR auth.uid() = user_id OR auth.uid() = admin_id);

-- Users can book available appointments
CREATE POLICY "Users can book available appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND (status = 'available' OR auth.uid() = user_id OR auth.uid() = admin_id));

-- Admins can create appointments
CREATE POLICY "Admins can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (
    auth.uid() = admin_id OR 
    EXISTS (
      SELECT 1 FROM public.admin_configs ac 
      WHERE ac.admin_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      ) AND ac.is_active = true
    )
  )
);

-- Admins can delete their appointments
CREATE POLICY "Admins can delete appointments" 
ON public.appointments 
FOR DELETE 
USING (
  auth.uid() = admin_id OR 
  EXISTS (
    SELECT 1 FROM public.admin_configs ac 
    WHERE ac.admin_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) AND ac.is_active = true
  )
);

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_admin_id ON public.appointments(admin_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);