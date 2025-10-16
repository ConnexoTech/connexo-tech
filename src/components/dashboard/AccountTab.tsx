import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AccountTab = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });

  const handleUpdateProfile = async () => {
    const { error } = await updateProfile({ username });
    if (error) {
      toast({ title: t("account.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("account.profileUpdated"), description: t("account.profileUpdatedDescription") });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({ title: t("account.error"), description: t("account.passwordMismatch"), variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordData.new });
    if (error) {
      toast({ title: t("account.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("account.passwordChanged"), description: t("account.passwordChangedDescription") });
      setPasswordData({ current: "", new: "", confirm: "" });
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("account.profileInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t("account.username")}</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("account.email")}</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <Button onClick={handleUpdateProfile}>{t("account.saveChanges")}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("account.changePassword")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="password" placeholder={t("account.currentPassword")} value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} />
          <Input type="password" placeholder={t("account.newPassword")} value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} />
          <Input type="password" placeholder={t("account.confirmPassword")} value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} />
          <Button onClick={handleChangePassword}>{t("account.updatePasswordButton")}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTab;
