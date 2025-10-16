import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AppearanceTab = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { profile, themeSettings, updateProfile, updateTheme } = useProfile();
  const { toast } = useToast();

  const [title, setTitle] = useState(profile?.title || "");
  const [role, setRole] = useState(profile?.role || "");
  const [company, setCompany] = useState(profile?.company || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile?.profile_picture_url || "");
  const [coverImageUrl, setCoverImageUrl] = useState(profile?.cover_image_url || "");
  const [bgType, setBgType] = useState(themeSettings?.bg_type || "color");
  const [bgColor, setBgColor] = useState(themeSettings?.bg_color || "#210900");
  const [buttonStyle, setButtonStyle] = useState(themeSettings?.button_style || "rounded");
  const [buttonBgColor, setButtonBgColor] = useState(themeSettings?.button_bg_color || "#ff6600");
  const [buttonTextColor, setButtonTextColor] = useState(themeSettings?.button_text_color || "#ffffff");
  const [fontFamily, setFontFamily] = useState(themeSettings?.font_family || "Space Grotesk");
  const [textColor, setTextColor] = useState(themeSettings?.text_color || "#ffffff");
  const [uploading, setUploading] = useState(false);

  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File, type: 'profile' | 'cover') => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Por favor selecciona una imagen", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file, 'profile');
      if (url) {
        setProfilePictureUrl(url);
        toast({ title: "Éxito", description: "Foto de perfil subida correctamente" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Error al subir la imagen", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Por favor selecciona una imagen", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file, 'cover');
      if (url) {
        setCoverImageUrl(url);
        toast({ title: "Éxito", description: "Foto de portada subida correctamente" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Error al subir la imagen", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const saveChanges = async () => {
    const { error: profileError } = await updateProfile({ 
      title, 
      role,
      company,
      bio,
      profile_picture_url: profilePictureUrl,
      cover_image_url: coverImageUrl
    });
    
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

    toast({ title: t("common.success"), description: "Apariencia guardada correctamente" });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <Label>Foto de Perfil</Label>
            <div className="flex items-center gap-4">
              {profilePictureUrl && (
                <div className="relative">
                  <img 
                    src={profilePictureUrl} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => setProfilePictureUrl("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <input
                ref={profilePictureInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => profilePictureInputRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Subiendo..." : "Subir Foto de Perfil"}
              </Button>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label>Foto de Portada</Label>
            <div className="flex flex-col gap-4">
              {coverImageUrl && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <img 
                    src={coverImageUrl} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={() => setCoverImageUrl("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <input
                ref={coverImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => coverImageInputRef.current?.click()}
                disabled={uploading}
                className="gap-2 w-fit"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Subiendo..." : "Subir Foto de Portada"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Nombre</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Input 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              placeholder="Ej: CEO, Diseñador, Desarrollador"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input 
              id="company" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)} 
              placeholder="Nombre de tu empresa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t("appearance.bio")}</Label>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              rows={3}
              placeholder="Describe brevemente sobre ti"
            />
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
        <Button onClick={saveChanges} className="gap-2" disabled={uploading}>
          <Save className="h-4 w-4" />
          {t("common.saveChanges")}
        </Button>
      </div>
    </div>
  );
};

export default AppearanceTab;
