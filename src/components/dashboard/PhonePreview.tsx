import { Mail, Phone, MapPin, Instagram, Globe } from "lucide-react";

interface PhonePreviewProps {
  appearance: {
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
    fontFamily: string;
    textColor: string;
  };
}

const PhonePreview = ({ appearance }: PhonePreviewProps) => {
  const getButtonRadius = () => {
    switch (appearance.buttonStyle) {
      case "rectangular": return "4px";
      case "rounded": return "12px";
      case "pill": return "9999px";
      default: return "12px";
    }
  };

  const backgroundStyle = appearance.bgType === "color"
    ? { backgroundColor: appearance.bgColor }
    : { backgroundImage: `url(${appearance.bgImage})`, backgroundSize: "cover" };

  return (
    <div className="mx-auto max-w-sm">
      <div className="bg-card border-4 border-border rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="bg-background h-6 flex items-center justify-center gap-2">
          <div className="w-16 h-1 bg-foreground/20 rounded-full"></div>
        </div>
        
        <div
          className="h-[600px] overflow-y-auto"
          style={{
            ...backgroundStyle,
            fontFamily: appearance.fontFamily,
          }}
        >
          <div className="p-6 space-y-6">
            {/* Cover Image */}
            {appearance.coverImage && (
              <div className="w-full h-32 rounded-lg overflow-hidden relative">
                <img src={appearance.coverImage} alt="Cover" className="w-full h-full object-cover" />
                {/* Profile Image Overlay */}
                {appearance.profileImage && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <img
                      src={appearance.profileImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Profile Image (if no cover) */}
            {!appearance.coverImage && appearance.profileImage && (
              <div className="flex justify-center">
                <img
                  src={appearance.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white/10 object-cover"
                />
              </div>
            )}

            {/* Title & Info */}
            <div className="text-center space-y-2">
              <h2
                className="text-xl font-bold"
                style={{ color: appearance.textColor }}
              >
                {appearance.title}
              </h2>
              {appearance.role && (
                <p
                  className="text-base font-medium opacity-90"
                  style={{ color: appearance.textColor }}
                >
                  {appearance.role}
                </p>
              )}
              {appearance.company && (
                <p
                  className="text-sm opacity-75"
                  style={{ color: appearance.textColor }}
                >
                  {appearance.company}
                </p>
              )}
              <p
                className="text-sm opacity-80"
                style={{ color: appearance.textColor }}
              >
                {appearance.bio}
              </p>
            </div>

            {/* Contact Icons */}
            <div className="flex justify-center gap-4">
              <button
                className="p-2 rounded-full"
                style={{
                  backgroundColor: appearance.buttonBgColor + "40",
                  color: appearance.textColor,
                }}
              >
                <Mail className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-full"
                style={{
                  backgroundColor: appearance.buttonBgColor + "40",
                  color: appearance.textColor,
                }}
              >
                <Phone className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-full"
                style={{
                  backgroundColor: appearance.buttonBgColor + "40",
                  color: appearance.textColor,
                }}
              >
                <MapPin className="h-5 w-5" />
              </button>
            </div>

            {/* Sample Links */}
            <div className="space-y-3">
              {[
                { icon: Instagram, title: "Instagram" },
                { icon: Globe, title: "Website" },
              ].map((link, i) => (
                <button
                  key={i}
                  className="w-full p-4 flex items-center justify-center gap-3 transition-transform hover:scale-105"
                  style={{
                    backgroundColor: appearance.buttonBgColor,
                    color: appearance.buttonTextColor,
                    borderRadius: getButtonRadius(),
                  }}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium">{link.title}</span>
                </button>
              ))}
            </div>

            {/* Save Contact Button */}
            <button
              className="w-full py-3 font-medium border-2 transition-transform hover:scale-105"
              style={{
                borderColor: appearance.buttonBgColor,
                color: appearance.textColor,
                borderRadius: getButtonRadius(),
              }}
            >
              Save Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
