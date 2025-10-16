import { useLanguage } from "@/contexts/LanguageContext";
import logoIcon from "@/assets/logo-icon.png";

interface FooterProps {
  className?: string;
}

export const Footer = ({ className = "" }: FooterProps) => {
  const { t } = useLanguage();

  return (
    <footer className={`w-full py-4 sm:py-6 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <img src={logoIcon} alt="Connexo" className="h-4 w-4" />
          <span>{t("common.poweredBy")} Connexo</span>
        </div>
      </div>
    </footer>
  );
};
