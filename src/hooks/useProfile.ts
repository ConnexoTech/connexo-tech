import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Link {
  id: string;
  title: string;
  url: string;
  icon_class: string;
  is_active: boolean;
  display_order: number;
}

export interface ProfileData {
  id: string;
  username: string;
  title: string | null;
  role: string | null;
  bio: string | null;
  profile_picture_url: string | null;
  cover_image_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_location: string | null;
  company: string | null;
}

export interface ThemeSettings {
  id: string;
  bg_type: string;
  bg_color: string;
  bg_image_url: string | null;
  button_style: string;
  button_bg_color: string;
  button_text_color: string;
  button_shadow: boolean;
  font_family: string;
  text_color: string;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the current user from Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.log("No authenticated user");
          setLoading(false);
          return;
        }

        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (!existingProfile) {
          // Create profile if it doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              user_id: user.id,
              username: user.email?.split('@')[0] || 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          setProfile(existingProfile);
        }

        // Fetch theme settings
        if (existingProfile) {
          const { data: themeData, error: themeError } = await supabase
            .from("theme_settings")
            .select("*")
            .eq("profile_id", existingProfile.id)
            .single();

          if (themeError && themeError.code !== 'PGRST116') throw themeError;
          setThemeSettings(themeData);
        }

        // Fetch links
        if (existingProfile) {
          const { data: linksData, error: linksError } = await supabase
            .from("links")
            .select("*")
            .eq("profile_id", existingProfile.id)
            .order("display_order", { ascending: true });

          if (linksError) throw linksError;
          setLinks(linksData || []);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Update profile
  const updateProfile = async (updates: Partial<ProfileData>) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return { error: new Error("Not authenticated") };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Update theme settings
  const updateTheme = async (updates: Partial<ThemeSettings>) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return { error: new Error("Not authenticated") };

      if (!profile) return { error: new Error("No profile") };

      const { error } = await supabase
        .from("theme_settings")
        .update(updates)
        .eq("profile_id", profile.id);

      if (error) throw error;

      setThemeSettings(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Update links
  const updateLinks = async (newLinks: Link[]) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return { error: new Error("Not authenticated") };

      if (!profile) return { error: new Error("No profile") };

      // Delete all existing links
      await supabase.from("links").delete().eq("profile_id", profile.id);

      // Insert new links
      const linksToInsert = newLinks.map((link, index) => ({
        profile_id: profile.id,
        title: link.title,
        url: link.url,
        icon_class: link.icon_class,
        is_active: link.is_active,
        display_order: index,
      }));

      const { error } = await supabase.from("links").insert(linksToInsert);

      if (error) throw error;

      setLinks(newLinks);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    profile,
    themeSettings,
    links,
    loading,
    updateProfile,
    updateTheme,
    updateLinks,
  };
};
