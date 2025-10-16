import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Palette, Zap } from "lucide-react";
import logoFull from "@/assets/logo-full.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Footer } from "@/components/Footer";

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <nav className="flex items-center justify-between mb-12 sm:mb-16 md:mb-20 gap-2">
          <img src={logoFull} alt="Connexo" className="h-8 sm:h-10" />
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSelector />
            <Link to="/auth">
              <Button size="sm" className="sm:h-10 text-xs sm:text-sm">{t("nav.getStarted")}</Button>
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-tight px-4">
            {t("home.hero.title")}{" "}
            <span className="text-primary">{t("home.hero.titleHighlight")}</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t("home.hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-6 md:pt-8 px-4">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto text-sm sm:text-base">
                {t("home.hero.createProfile")}
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mt-16 sm:mt-24 md:mt-32 px-4">
          <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border">
            <div className="inline-flex p-3 rounded-lg bg-primary/10">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{t("home.features.visualEditor.title")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.visualEditor.description")}
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border">
            <div className="inline-flex p-3 rounded-lg bg-primary/10">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{t("home.features.analytics.title")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.analytics.description")}
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border">
            <div className="inline-flex p-3 rounded-lg bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{t("home.features.fast.title")}</h3>
            <p className="text-muted-foreground">
              {t("home.features.fast.description")}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
