-- Create workout_plans table for admin-created workout plans
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  observations TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_configs table for admin settings
CREATE TABLE public.admin_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default admin
INSERT INTO public.admin_configs (admin_email) VALUES ('yaraka78@gmail.com');

-- Enable RLS on workout_plans
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for workout_plans
-- Users can view their own workout plans
CREATE POLICY "Users can view their own workout plans" 
ON public.workout_plans 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all workout plans
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

-- Admins can insert workout plans for any user
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

-- Admins can update workout plans they created
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

-- Admins can delete workout plans they created
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

-- Enable RLS on admin_configs
ALTER TABLE public.admin_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_configs
-- Only admins can view admin configs
CREATE POLICY "Admins can view admin configs" 
ON public.admin_configs 
FOR SELECT 
USING (
  admin_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates on workout_plans
CREATE TRIGGER update_workout_plans_updated_at
  BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on admin_configs
CREATE TRIGGER update_admin_configs_updated_at
  BEFORE UPDATE ON public.admin_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  check_email TEXT;
BEGIN
  -- Use provided email or get current user's email
  check_email := COALESCE(
    user_email,
    (SELECT email FROM auth.users WHERE id = auth.uid())
  );
  
  -- Check if email exists in admin_configs and is active
  RETURN EXISTS (
    SELECT 1 FROM public.admin_configs 
    WHERE admin_email = check_email AND is_active = true
  );
END;
$$;
