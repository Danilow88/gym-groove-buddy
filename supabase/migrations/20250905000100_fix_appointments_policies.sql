-- Restore and correct RLS policies for appointments to allow booking and admin management

-- Ensure table exists
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

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Drop possibly conflicting policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' AND policyname = 'Anyone can view available appointments'
  ) THEN
    EXECUTE 'DROP POLICY "Anyone can view available appointments" ON public.appointments';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' AND policyname = 'Users can view their appointments and admins see all'
  ) THEN
    EXECUTE 'DROP POLICY "Users can view their appointments and admins see all" ON public.appointments';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' AND policyname = 'Users can book available appointments'
  ) THEN
    EXECUTE 'DROP POLICY "Users can book available appointments" ON public.appointments';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' AND policyname = 'Admins can create appointments'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can create appointments" ON public.appointments';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' AND policyname = 'Admins can update appointments'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can update appointments" ON public.appointments';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' AND policyname = 'Admins can delete appointments'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can delete appointments" ON public.appointments';
  END IF;
END $$;

-- Read policy: available to anyone, plus own bookings or admin
CREATE POLICY "Users can view their appointments and admins see all"
ON public.appointments
FOR SELECT
USING (
  status = 'available'::text
  OR auth.uid() = user_id
  OR auth.uid() = admin_id
  OR public.is_admin(NULL::text)
);

-- Book/cancel/update policy for users and admins
CREATE POLICY "Users can book available appointments"
ON public.appointments
FOR UPDATE
USING (
  -- users can book an available slot or update their own booking
  (auth.uid() IS NOT NULL AND (status = 'available' OR auth.uid() = user_id))
  OR public.is_admin(NULL::text)
);

-- Admins can insert new available slots
CREATE POLICY "Admins can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (
  public.is_admin(NULL::text) OR auth.uid() = admin_id
);

-- Admins can delete appointments
CREATE POLICY "Admins can delete appointments"
ON public.appointments
FOR DELETE
USING (public.is_admin(NULL::text));

-- Maintain updated_at
CREATE OR REPLACE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_admin_id ON public.appointments(admin_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);

