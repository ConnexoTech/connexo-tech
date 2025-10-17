import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, ThemeSettings, Link } from "./useProfile";

export const usePublicProfile = (username: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const profileCandidates = ["profiles", "Perfiles"];
        let profileData: any = null;
        let lastProfileErr: any = null;

        for (const table of profileCandidates) {
          const { data, error } = await supabase
            .from(table as any)
            .select("id, username, title, role, company, bio, profile_picture_url, cover_image_url")
            .eq("username", username)
            .maybeSingle();

          if (error) {
            if (
              error.code === "PGRST205" ||
              (typeof error.message === "string" &&
                error.message.includes("Could not find the table"))
            ) {
              lastProfileErr = error;
              continue;
            }
            // If no row found, keep data null and stop trying further
            if (error.code === "PGRST116") {
              lastProfileErr = error;
              break;
            }
            lastProfileErr = error;
            break;
          } else {
            profileData = data;
            break;
          }
        }
        if (!profileData) {
          if (lastProfileErr?.code === "PGRST116") {
            setError("Profile not found");
          } else if (lastProfileErr) {
            throw lastProfileErr;
          } else {
            setError("Profile not found");
          }
          return;
        }

        setProfile(profileData as any);

        // Fetch theme settings
        const { data: themeData, error: themeError } = await supabase
          .from("theme_settings")
          .select("*")
          .eq("profile_id", profileData.id)
          .single();

        if (themeError) throw themeError;
        setThemeSettings(themeData);

        // Fetch active links only
        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("*")
          .eq("profile_id", profileData.id)
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (linksError) throw linksError;
        setLinks(linksData || []);
      } catch (err: any) {
        console.error("Error fetching public profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPublicProfile();
    }
  }, [username]);

  return { profile, themeSettings, links, loading, error };
};
