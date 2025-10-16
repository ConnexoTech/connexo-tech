import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";

const AccountTab = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { profile, updateUsername } = useProfile();
  const [email, setEmail] = useState("you@example.com");

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleUpdateProfile = () => {
    updateUsername(profile.username);
    toast({
      title: t("account.profileUpdated"),
      description: t("account.profileUpdatedDescription"),
    });
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: t("account.error"),
        description: t("account.passwordMismatch"),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("account.passwordChanged"),
      description: t("account.passwordChangedDescription"),
    });

    setPasswordData({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Profile Data */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">{t("account.profileInfo")}</CardTitle>
          <CardDescription className="text-sm">{t("account.updateAccountDetails")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="username">{t("account.username")}</Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) => updateUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("account.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button onClick={handleUpdateProfile} className="w-full sm:w-auto">{t("account.saveChanges")}</Button>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">{t("account.changePassword")}</CardTitle>
          <CardDescription className="text-sm">{t("account.updatePassword")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t("account.currentPassword")}</Label>
            <Input
              id="current-password"
              type="password"
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">{t("account.newPassword")}</Label>
            <Input
              id="new-password"
              type="password"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t("account.confirmPassword")}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
            />
          </div>

          <Button onClick={handleChangePassword} className="w-full sm:w-auto">{t("account.updatePasswordButton")}</Button>
        </CardContent>
      </Card>

      {/* Plan & Billing */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">{t("account.planBilling")}</CardTitle>
          <CardDescription className="text-sm">{t("account.manageSubscription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t("account.currentPlan")}</p>
              <p className="text-sm text-muted-foreground">{t("account.free")}</p>
            </div>
            <Badge>{t("account.active")}</Badge>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <Label htmlFor="custom-domain">{t("account.customDomain")}</Label>
            <div className="flex gap-2">
              <Input
                id="custom-domain"
                placeholder="yourdomain.com"
                disabled
              />
              <Button variant="secondary" disabled>
                {t("account.upgrade")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("account.customDomainNote")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;
