import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, Mail, Phone, MapPin, ArrowLeft, Save, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";

const PublicProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile, themeSettings, links, loading, error } = usePublicProfile(username || "");

  // Check if user is viewing their own profile
  const isOwnProfile = user && profile && username === profile.username;

  // Update page title dynamically
  useEffect(() => {
    if (profile) {
      const pageTitle = profile.bio ? `${profile.title} - ${profile.bio}` : profile.title || "Profile";
      document.title = pageTitle;
    }
  }, [profile]);

  const getButtonRadius = () => {
    if (!themeSettings) return "rounded-lg";
    switch (themeSettings.button_style) {
      case "rectangular":
        return "rounded-none";
      case "rounded":
        return "rounded-lg";
      case "pill":
        return "rounded-full";
      default:
        return "rounded-lg";
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    return Icon ? <Icon className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />;
  };

  const downloadVCard = () => {
    if (!profile) return;
    
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.title || ""}
NOTE:${profile.bio || ""}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(profile.title || "profile").replace(/\s+/g, "_")}_contact.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProfile = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.title || "Profile"} - ${profile?.bio || ""}`,
          text: `Check out ${profile?.title || "this profile"}`,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        toast({
          title: "Link copied",
          description: "Profile link copied to clipboard",
        });
      } catch (err) {
        console.error("Error copying link:", err);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  // Error or not found state
  if (error || !profile || !themeSettings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const backgroundStyle =
    themeSettings.bg_type === "color"
      ? { backgroundColor: themeSettings.bg_color }
      : {
          backgroundImage: `url(${themeSettings.bg_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };

  return (
    <div className="min-h-screen w-full flex flex-col" style={backgroundStyle}>
      {/* Back to Dashboard Button */}
      {isOwnProfile && (
        <div className="w-full p-4">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl">
          <div className="space-y-6 sm:space-y-8">
            {/* Cover Image with Profile Image Overlay */}
            {profile.cover_image_url && (
              <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-xl overflow-hidden">
                <img
                  src={profile.cover_image_url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                {/* Profile Image Overlay */}
                {profile.profile_picture_url && (
                  <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-20 left-1/2 transform -translate-x-1/2">
                    <img
                      src={profile.profile_picture_url}
                      alt="Profile"
                      className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Profile Info */}
            <div className="flex flex-col items-center space-y-2 px-4 sm:px-0 pt-8 sm:pt-10 md:pt-12">
              <div className="text-center space-y-2">
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold"
                  style={{
                    color: themeSettings.text_color,
                    fontFamily: themeSettings.font_family,
                  }}
                >
                  {profile.title}
                </h1>
                {profile.company && (
                  <p
                    className="text-base sm:text-lg md:text-xl font-medium"
                    style={{
                      color: themeSettings.text_color,
                      opacity: 0.85,
                      fontFamily: themeSettings.font_family,
                    }}
                  >
                    {profile.company}
                  </p>
                )}
                {profile.bio && (
                  <p
                    className="text-sm sm:text-base md:text-lg max-w-md mx-auto px-4"
                    style={{
                      color: themeSettings.text_color,
                      opacity: 0.9,
                      fontFamily: themeSettings.font_family,
                    }}
                  >
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 px-4 sm:px-0">
              <Button
                onClick={downloadVCard}
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                style={{ color: themeSettings.text_color }}
                title="Save Contact"
              >
                <Save className="h-5 w-5" />
              </Button>
              <Button
                onClick={shareProfile}
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                style={{ color: themeSettings.text_color }}
                title="Share Profile"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>

            {/* Links */}
            <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 md:px-8">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    className={`w-full justify-between gap-3 h-auto py-3 sm:py-4 px-4 sm:px-6 text-base sm:text-lg transition-all hover:scale-105 ${getButtonRadius()}`}
                    style={{
                      backgroundColor: themeSettings.button_bg_color,
                      color: themeSettings.button_text_color,
                      fontFamily: themeSettings.font_family,
                      boxShadow: themeSettings.button_shadow
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                        : "none",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(link.icon_class)}
                      <span className="font-medium">{link.title}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicProfile;
