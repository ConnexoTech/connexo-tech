-- Fix RLS policies to use security definer function instead of subqueries
-- This prevents potential infinite recursion and improves performance

-- 1. Update theme_settings policy
DROP POLICY IF EXISTS "Users can manage own theme settings" ON public.theme_settings;
CREATE POLICY "Users can manage own theme settings"
  ON public.theme_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = theme_settings.profile_id 
      AND public.is_profile_owner(profiles.user_id)
    )
  );

-- 2. Update analytics_events policy
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics_events;
CREATE POLICY "Users can view own analytics"
  ON public.analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = analytics_events.profile_id 
      AND public.is_profile_owner(profiles.user_id)
    )
  );

-- 3. Update links policy
DROP POLICY IF EXISTS "Users can manage own links" ON public.links;
CREATE POLICY "Users can manage own links"
  ON public.links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = links.profile_id 
      AND public.is_profile_owner(profiles.user_id)
    )
  );

-- 4. Restrict analytics insertion to specific event types and require valid profile_id
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics_events;
CREATE POLICY "Public can insert view analytics"
  ON public.analytics_events FOR INSERT
  WITH CHECK (
    event_type IN ('profile_view', 'link_click')
    AND profile_id IN (SELECT id FROM public.profiles)
  );