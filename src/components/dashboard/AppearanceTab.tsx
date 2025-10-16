import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useToast } from "@/hooks/use-toast";

const AppearanceTab = () => {
  const { t } = useLanguage();
  const { profile, themeSettings, updateProfile, updateTheme } = useProfile();
  const { toast } = useToast();

  const [title, setTitle] = useState(profile?.title || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [bgType, setBgType] = useState(themeSettings?.bg_type || "color");
  const [bgColor, setBgColor] = useState(themeSettings?.bg_color || "#210900");
  const [buttonStyle, setButtonStyle] = useState(themeSettings?.button_style || "rounded");
  const [buttonBgColor, setButtonBgColor] = useState(themeSettings?.button_bg_color || "#ff6600");
  const [buttonTextColor, setButtonTextColor] = useState(themeSettings?.button_text_color || "#ffffff");
  const [fontFamily, setFontFamily] = useState(themeSettings?.font_family || "Space Grotesk");
  const [textColor, setTextColor] = useState(themeSettings?.text_color || "#ffffff");

  const saveChanges = async () => {
    const { error: profileError } = await updateProfile({ title, bio });
    if (profileError) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
      return;
    }

    const { error: themeError } = await updateTheme({
      bg_type: bgType,
      bg_color: bgColor,
      button_style: buttonStyle,
      button_bg_color: buttonBgColor,
      button_text_color: buttonTextColor,
      font_family: fontFamily,
      text_color: textColor,
    });

    if (themeError) {
      toast({ title: "Error", description: "Failed to update theme", variant: "destructive" });
      return;
    }

    toast({ title: t("common.success"), description: "Appearance saved successfully" });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.profile")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("appearance.titleLabel")}</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">{t("appearance.bio")}</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.background")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("appearance.backgroundType")}</Label>
            <Select value={bgType} onValueChange={setBgType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">{t("appearance.solidColor")}</SelectItem>
                <SelectItem value="image">{t("appearance.image")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("appearance.color")}</Label>
            <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("appearance.buttonStyle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={buttonStyle} onValueChange={setButtonStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rectangular">{t("appearance.rectangular")}</SelectItem>
              <SelectItem value="rounded">{t("appearance.rounded")}</SelectItem>
              <SelectItem value="pill">{t("appearance.pill")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("appearance.buttonBackground")}</Label>
              <Input type="color" value={buttonBgColor} onChange={(e) => setButtonBgColor(e.target.value)} />
            </div>
            <div>
              <Label>{t("appearance.buttonTextColor")}</Label>
              <Input type="color" value={buttonTextColor} onChange={(e) => setButtonTextColor(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={saveChanges} className="gap-2">
          <Save className="h-4 w-4" />
          {t("common.saveChanges")}
        </Button>
      </div>
    </div>
  );
};

export default AppearanceTab;
