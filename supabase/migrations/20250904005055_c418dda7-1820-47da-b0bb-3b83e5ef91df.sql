-- Fix RLS policies to avoid direct access to auth.users and use security definer helper instead

-- APPOINTMENTS
DROP POLICY IF EXISTS "Users can view their appointments and admins see all" ON public.appointments;
CREATE POLICY "Users can view their appointments and admins see all"
ON public.appointments
FOR SELECT
USING (
  status = 'available'::text
  OR auth.uid() = user_id
  OR auth.uid() = admin_id
  OR public.is_admin(NULL::text)
);

DROP POLICY IF EXISTS "Admins can delete appointments" ON public.appointments;
CREATE POLICY "Admins can delete appointments"
ON public.appointments
FOR DELETE
USING (public.is_admin(NULL::text));

-- WEEKLY_WORKOUT_DETAILS
DROP POLICY IF EXISTS "Admins can view all workout details" ON public.weekly_workout_details;
CREATE POLICY "Admins can view all workout details"
ON public.weekly_workout_details
FOR SELECT
USING (public.is_admin(NULL::text));

DROP POLICY IF EXISTS "Admins can insert workout details" ON public.weekly_workout_details;
CREATE POLICY "Admins can insert workout details"
ON public.weekly_workout_details
FOR INSERT
WITH CHECK (public.is_admin(NULL::text));

DROP POLICY IF EXISTS "Admins can update workout details" ON public.weekly_workout_details;
CREATE POLICY "Admins can update workout details"
ON public.weekly_workout_details
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans wp
    WHERE wp.id = weekly_workout_details.workout_plan_id
      AND wp.created_by = auth.uid()
  )
  AND public.is_admin(NULL::text)
);

DROP POLICY IF EXISTS "Admins can delete workout details" ON public.weekly_workout_details;
CREATE POLICY "Admins can delete workout details"
ON public.weekly_workout_details
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans wp
    WHERE wp.id = weekly_workout_details.workout_plan_id
      AND wp.created_by = auth.uid()
  )
  AND public.is_admin(NULL::text)
);

-- WORKOUT_PLANS
DROP POLICY IF EXISTS "Admins can view all workout plans" ON public.workout_plans;
CREATE POLICY "Admins can view all workout plans"
ON public.workout_plans
FOR SELECT
USING (public.is_admin(NULL::text));