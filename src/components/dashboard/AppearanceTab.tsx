import { useEffect } from "react";
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
import PhonePreview from "./PhonePreview";

const AppearanceTab = () => {
  const { t } = useLanguage();
  const { profile, updateAppearance } = useProfile();
  const { toast } = useToast();
  const appearance = profile.appearance;

  useEffect(() => {
    // Auto-save appearance when it changes
    const timer = setTimeout(() => {
      updateAppearance(appearance);
    }, 500);
    return () => clearTimeout(timer);
  }, [appearance]);

  const saveChanges = () => {
    updateAppearance(appearance);
    toast({
      title: t("common.success"),
      description: "Appearance changes saved successfully",
    });
  };

  const handleImageUpload = (field: "profileImage" | "coverImage", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAppearance({ ...appearance, [field]: reader.result as string });
        toast({
          title: t("common.success"),
          description: "Image uploaded",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAppearanceChange = (field: keyof typeof appearance, value: any) => {
    updateAppearance({ ...appearance, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-7xl mx-auto">
      {/* Editor Panel */}
      <div className="space-y-4 sm:space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">{t("appearance.profile")}</CardTitle>
            <CardDescription className="text-sm">{t("appearance.profileDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label>{t("appearance.profilePicture")}</Label>
              <div className="flex items-center gap-4">
                {appearance.profileImage && (
                  <img src={appearance.profileImage} alt="Profile" className="h-16 w-16 rounded-full object-cover" />
                )}
                <Button variant="secondary" asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {t("appearance.upload")}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload("profileImage", e)}
                    />
                  </label>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("appearance.coverImage")}</Label>
              <div className="flex items-center gap-4">
                {appearance.coverImage && (
                  <img src={appearance.coverImage} alt="Cover" className="h-16 w-32 rounded object-cover" />
                )}
                <Button variant="secondary" asChild>
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {t("appearance.upload")}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload("coverImage", e)}
                    />
                  </label>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">{t("appearance.titleLabel")}</Label>
              <Input
                id="title"
                value={appearance.title}
                onChange={(e) => handleAppearanceChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t("appearance.role")}</Label>
              <Input
                id="role"
                value={appearance.role}
                onChange={(e) => handleAppearanceChange("role", e.target.value)}
                placeholder="Ej: Diseñador UX/UI"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t("appearance.company")}</Label>
              <Input
                id="company"
                value={appearance.company}
                onChange={(e) => handleAppearanceChange("company", e.target.value)}
                placeholder="Ej: Empresa XYZ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("appearance.bio")}</Label>
              <Textarea
                id="bio"
                value={appearance.bio}
                onChange={(e) => handleAppearanceChange("bio", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Background Section */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">{t("appearance.background")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="bgType">{t("appearance.backgroundType")}</Label>
              <Select value={appearance.bgType} onValueChange={(value) => handleAppearanceChange("bgType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">{t("appearance.solidColor")}</SelectItem>
                  <SelectItem value="image">{t("appearance.image")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {appearance.bgType === "color" ? (
              <div className="space-y-2">
                <Label htmlFor="bgColor">{t("appearance.color")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={appearance.bgColor}
                    onChange={(e) => handleAppearanceChange("bgColor", e.target.value)}
                    className="h-10 w-20"
                  />
                  <Input
                    value={appearance.bgColor}
                    onChange={(e) => handleAppearanceChange("bgColor", e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>{t("appearance.backgroundImage")}</Label>
                <Button variant="secondary" asChild className="w-full">
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {t("appearance.uploadImage")}
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Button Styles */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">{t("appearance.buttonStyle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label>{t("appearance.style")}</Label>
              <Select value={appearance.buttonStyle} onValueChange={(value) => handleAppearanceChange("buttonStyle", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rectangular">{t("appearance.rectangular")}</SelectItem>
                  <SelectItem value="rounded">{t("appearance.rounded")}</SelectItem>
                  <SelectItem value="pill">{t("appearance.pill")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("appearance.buttonBackground")}</Label>
                <Input
                  type="color"
                  value={appearance.buttonBgColor}
                  onChange={(e) => handleAppearanceChange("buttonBgColor", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("appearance.buttonTextColor")}</Label>
                <Input
                  type="color"
                  value={appearance.buttonTextColor}
                  onChange={(e) => handleAppearanceChange("buttonTextColor", e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">{t("appearance.typography")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label>{t("appearance.fontFamily")}</Label>
              <Select value={appearance.fontFamily} onValueChange={(value) => handleAppearanceChange("fontFamily", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                  <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("appearance.textColor")}</Label>
              <Input
                type="color"
                value={appearance.textColor}
                onChange={(e) => handleAppearanceChange("textColor", e.target.value)}
                className="h-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="lg:sticky lg:top-24 h-fit order-first lg:order-last">
        <PhonePreview appearance={appearance} />
      </div>

      {/* Save Changes Button */}
      <div className="lg:col-span-2 flex justify-center pt-6">
        <Button onClick={saveChanges} className="gap-2">
          <Save className="h-4 w-4" />
          {t("common.saveChanges")}
        </Button>
      </div>
    </div>
  );
};

export default AppearanceTab;
