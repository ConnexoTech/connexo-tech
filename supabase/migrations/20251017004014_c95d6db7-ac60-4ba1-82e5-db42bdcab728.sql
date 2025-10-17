-- Ensure contact_phone column is text type
ALTER TABLE public.profiles 
  ALTER COLUMN contact_phone TYPE text 
  USING contact_phone::text;