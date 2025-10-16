import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Link2, Palette, BarChart3, User, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import logoIcon from "@/assets/logo-icon.png";
import LinksTab from "@/components/dashboard/LinksTab";
import AppearanceTab from "@/components/dashboard/AppearanceTab";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import AccountTab from "@/components/dashboard/AccountTab";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("links");
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const viewPublicProfile = () => {
    navigate(`/${profile.username}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img src={logoIcon} alt="Connexo" className="h-6 sm:h-8 flex-shrink-0" />
            <h1 className="text-base sm:text-xl font-display font-bold truncate">{t("dashboard.title")}</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={viewPublicProfile} className="gap-1 sm:gap-2 px-2 sm:px-3">
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">View Profile</span>
            </Button>
            <LanguageSelector />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="px-2 sm:px-3">
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden md:inline text-xs sm:text-sm">{t("nav.logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-4 sm:mb-6 md:mb-8 h-auto gap-1 sm:gap-0">
            <TabsTrigger value="links" className="gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 flex-col sm:flex-row text-xs sm:text-sm">
              <Link2 className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-sm">{t("dashboard.tabs.links")}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 flex-col sm:flex-row text-xs sm:text-sm">
              <Palette className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-sm">{t("dashboard.tabs.appearance")}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 flex-col sm:flex-row text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-sm">{t("dashboard.tabs.analytics")}</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-2.5 flex-col sm:flex-row text-xs sm:text-sm">
              <User className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-sm">{t("dashboard.tabs.account")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            <LinksTab />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
