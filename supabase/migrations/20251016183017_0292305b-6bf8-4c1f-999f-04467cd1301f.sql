-- Fix security linter issues

-- Drop and recreate the public_profiles view without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_profiles;

-- Create view with proper security (without SECURITY DEFINER)
CREATE VIEW public.public_profiles 
WITH (security_barrier = true) AS
  SELECT 
    id,
    user_id,
    username,
    profile_picture_url,
    cover_image_url,
    title,
    bio,
    created_at,
    updated_at
  FROM profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Fix the existing trigger function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;