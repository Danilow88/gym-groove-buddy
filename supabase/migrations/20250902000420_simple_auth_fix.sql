-- Simple auth fix - focus on making user registration work properly
-- This migration ensures new users can register properly

-- 1. Make sure admin is configured properly
INSERT INTO public.admin_configs (admin_email, is_active)
VALUES ('yaraka78@gmail.com', true)
ON CONFLICT (admin_email) DO UPDATE SET is_active = true;

-- 2. Function to check if user has completed email verification
CREATE OR REPLACE FUNCTION public.is_email_verified(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email_confirmed_at IS NOT NULL
    FROM auth.users
    WHERE id = COALESCE(user_id, auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant permissions for authenticated users to use the functions
GRANT EXECUTE ON FUNCTION public.is_email_verified TO authenticated, anon;
