import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
}

export interface AppearanceData {
  profileImage: string;
  coverImage: string;
  title: string;
  role: string;
  company: string;
  bio: string;
  bgType: string;
  bgColor: string;
  bgImage: string;
  buttonStyle: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonShadow: boolean;
  fontFamily: string;
  textColor: string;
}

export interface ProfileData {
  username: string;
  links: Link[];
  contactData: ContactData;
  appearance: AppearanceData;
}

interface ProfileContextType {
  profile: ProfileData;
  updateLinks: (links: Link[]) => void;
  updateContactData: (contactData: ContactData) => void;
  updateAppearance: (appearance: AppearanceData) => void;
  updateUsername: (username: string) => void;
}

const defaultProfile: ProfileData = {
  username: "yourname",
  links: [
    { id: "1", title: "Instagram", url: "https://instagram.com", icon: "instagram", isActive: true },
    { id: "2", title: "Website", url: "https://example.com", icon: "globe", isActive: true },
  ],
  contactData: {
    email: "",
    phone: "",
    location: "",
  },
  appearance: {
    profileImage: "",
    coverImage: "",
    title: "Your Name",
    role: "",
    company: "",
    bio: "Creative professional and digital enthusiast",
    bgType: "color",
    bgColor: "#210900",
    bgImage: "",
    buttonStyle: "rounded",
    buttonBgColor: "#ff6600",
    buttonTextColor: "#ffffff",
    buttonShadow: true,
    fontFamily: "Space Grotesk",
    textColor: "#ffffff",
  },
};

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
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem("profileData");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(profile));
  }, [profile]);

  const updateLinks = (links: Link[]) => {
    setProfile((prev) => ({ ...prev, links }));
  };

  const updateContactData = (contactData: ContactData) => {
    setProfile((prev) => ({ ...prev, contactData }));
  };

  const updateAppearance = (appearance: AppearanceData) => {
    setProfile((prev) => ({ ...prev, appearance }));
  };

  const updateUsername = (username: string) => {
    setProfile((prev) => ({ ...prev, username }));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateLinks,
        updateContactData,
        updateAppearance,
        updateUsername,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
