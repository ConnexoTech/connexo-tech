-- Add role column to profiles table for job title/position
ALTER TABLE public.profiles 
ADD COLUMN role TEXT;