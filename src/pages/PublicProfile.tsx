import { useEffect } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { ExternalLink, Mail, Phone, MapPin, ArrowLeft, Save, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import * as LucideIcons from "lucide-react";

const PublicProfile = () => {
  const { profile } = useProfile();
  const { appearance, links, contactData } = profile;
  const navigate = useNavigate();
  const { username } = useParams();
  const { t } = useLanguage();

  // Check if user is viewing their own profile (has session)
  const isOwnProfile = username === profile.username;

  // Update page title dynamically
  useEffect(() => {
    const { title, bio } = appearance;
    const pageTitle = bio ? `${title} - ${bio}` : title;
    document.title = pageTitle;
  }, [appearance.title, appearance.bio]);

  const getButtonRadius = () => {
    switch (appearance.buttonStyle) {
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

  const backgroundStyle =
    appearance.bgType === "color"
      ? { backgroundColor: appearance.bgColor }
      : {
          backgroundImage: `url(${appearance.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${appearance.title}
EMAIL:${contactData.email || ''}
TEL:${contactData.phone || ''}
ADR:;;${contactData.location || ''};;;;
NOTE:${appearance.bio || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appearance.title.replace(/\s+/g, '_')}_contact.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProfile = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${appearance.title} - ${appearance.bio}`,
          text: `Conoce el perfil de ${appearance.title}`,
          url: currentUrl,
        });
      } catch (err) {
        // Si el usuario cancela el compartir, no hacemos nada
        console.log('Compartir cancelado');
      }
    } else {
      // Fallback: copiar al portapapeles
      try {
        await navigator.clipboard.writeText(currentUrl);
        // Aquí podrías mostrar una notificación de que se copió el enlace
        console.log('Enlace copiado al portapapeles');
      } catch (err) {
        console.error('Error al copiar el enlace:', err);
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={backgroundStyle}
    >
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
            <div className="relative w-full h-32 sm:h-40 md:h-48 rounded-xl overflow-hidden">
              {appearance.coverImage && (
                <img
                  src={appearance.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Profile Image Overlay */}
              <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {appearance.profileImage && (
                    <img
                      src={appearance.profileImage}
                      alt="Profile"
                      className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center space-y-2 px-4 sm:px-0 pt-8 sm:pt-10 md:pt-12">
              <div className="text-center space-y-2">
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold"
                  style={{
                    color: appearance.textColor,
                    fontFamily: appearance.fontFamily,
                  }}
                >
                  {appearance.title}
                </h1>
                {appearance.role && (
                  <p
                    className="text-lg sm:text-xl md:text-2xl font-medium opacity-90"
                    style={{
                      color: appearance.textColor,
                      fontFamily: appearance.fontFamily,
                    }}
                  >
                    {appearance.role}
                  </p>
                )}
                {appearance.company && (
                  <p
                    className="text-base sm:text-lg md:text-xl opacity-75"
                    style={{
                      color: appearance.textColor,
                      fontFamily: appearance.fontFamily,
                    }}
                  >
                    {appearance.company}
                  </p>
                )}
                <p
                  className="text-sm sm:text-base md:text-lg max-w-md mx-auto px-4"
                  style={{
                    color: appearance.textColor,
                    opacity: 0.9,
                    fontFamily: appearance.fontFamily,
                  }}
                >
                  {appearance.bio}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            {(contactData.email || contactData.phone || contactData.location) && (
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                {contactData.email && (
                  <a
                    href={`mailto:${contactData.email}`}
                    className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all text-sm sm:text-base"
                    style={{ color: appearance.textColor }}
                  >
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">{contactData.email}</span>
                    <span className="sm:hidden">Email</span>
                  </a>
                )}
                {contactData.phone && (
                  <a
                    href={`tel:${contactData.phone}`}
                    className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all text-sm sm:text-base"
                    style={{ color: appearance.textColor }}
                  >
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">{contactData.phone}</span>
                    <span className="sm:hidden">Phone</span>
                  </a>
                )}
                {contactData.location && (
                  <div
                    className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-lg text-sm sm:text-base"
                    style={{ color: appearance.textColor }}
                  >
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>{contactData.location}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 px-4 sm:px-0">
              <Button
                onClick={downloadVCard}
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                style={{ color: appearance.textColor }}
                title="Guardar Contacto"
              >
                <Save className="h-5 w-5" />
              </Button>
              <Button
                onClick={shareProfile}
                size="icon"
                variant="outline"
                className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                style={{ color: appearance.textColor }}
                title="Compartir Perfil"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>

            {/* Links */}
            <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 md:px-8">
              {links
                .filter((link) => link.isActive && link.title && link.url)
                .map((link) => (
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
                        backgroundColor: appearance.buttonBgColor,
                        color: appearance.buttonTextColor,
                        fontFamily: appearance.fontFamily,
                        boxShadow: appearance.buttonShadow
                          ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                          : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {getIcon(link.icon)}
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

      {/* Footer at the bottom of the page */}
      <Footer />
    </div>
  );
};

export default PublicProfile;
