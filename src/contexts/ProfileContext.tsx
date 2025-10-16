import { createContext, useContext, ReactNode } from "react";
import { useProfileData, ProfileData, ThemeSettings, Link } from "@/hooks/useProfile";

interface ProfileContextType {
  profile: ProfileData | null;
  themeSettings: ThemeSettings | null;
  links: Link[];
  loading: boolean;
  updateProfile: (updates: Partial<ProfileData>) => Promise<{ error: Error | null }>;
  updateTheme: (updates: Partial<ThemeSettings>) => Promise<{ error: Error | null }>;
  updateLinks: (links: Link[]) => Promise<{ error: Error | null }>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const profileData = useProfileData();

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};

// Export types
export type { ProfileData, ThemeSettings, Link };
