import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, GripVertical, Trash2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile, Link } from "@/contexts/ProfileContext";
import { useToast } from "@/hooks/use-toast";
import IconPicker from "./IconPicker";

const LinksTab = () => {
  const { t } = useLanguage();
  const { profile, updateLinks, updateContactData } = useProfile();
  const { toast } = useToast();

  useEffect(() => {
    // Auto-save links when they change
    const timer = setTimeout(() => {
      updateLinks(profile.links);
    }, 500);
    return () => clearTimeout(timer);
  }, [profile.links]);

  useEffect(() => {
    // Auto-save contact data when it changes
    const timer = setTimeout(() => {
      updateContactData(profile.contactData);
    }, 500);
    return () => clearTimeout(timer);
  }, [profile.contactData]);

  const addLink = () => {
    const newLink: Link = {
      id: Date.now().toString(),
      title: "",
      url: "",
      icon: "link",
      isActive: true,
    };
    const newLinks = [...profile.links, newLink];
    updateLinks(newLinks);
    toast({
      title: t("common.success"),
      description: "Link added",
    });
  };

  const updateLink = (id: string, field: keyof Link, value: string | boolean) => {
    const newLinks = profile.links.map(link => link.id === id ? { ...link, [field]: value } : link);
    updateLinks(newLinks);
  };

  const deleteLink = (id: string) => {
    const newLinks = profile.links.filter(link => link.id !== id);
    updateLinks(newLinks);
    toast({
      title: t("common.success"),
      description: "Link deleted",
    });
  };

  const handleContactChange = (field: keyof typeof profile.contactData, value: string) => {
    updateContactData({ ...profile.contactData, [field]: value });
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.appearance.title}
EMAIL:${profile.contactData.email}
TEL:${profile.contactData.phone}
ADR:;;${profile.contactData.location};;;;
END:VCARD`;
    
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.vcf';
    a.click();
  };

  const saveChanges = () => {
    updateLinks(profile.links);
    updateContactData(profile.contactData);
    toast({
      title: t("common.success"),
      description: "Changes saved successfully",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Save Button at the top */}
      <div className="flex justify-end">
        <Button onClick={saveChanges} className="gap-2">
          <Save className="h-4 w-4" />
          {t("common.saveChanges")}
        </Button>
      </div>

      {/* Contact Data Section */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">{t("links.contactInfo")}</CardTitle>
          <CardDescription className="text-sm">{t("links.contactDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={profile.contactData.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("links.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={profile.contactData.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t("links.location")}</Label>
            <Input
              id="location"
              placeholder="Caracas, Venezuela"
              value={profile.contactData.location}
              onChange={(e) => handleContactChange("location", e.target.value)}
            />
          </div>
          <Button onClick={downloadVCard} variant="secondary" className="w-full sm:w-auto">
            {t("links.downloadVCard")}
          </Button>
        </CardContent>
      </Card>

      {/* Links Section */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl">{t("links.yourLinks")}</CardTitle>
          <CardDescription className="text-sm">{t("links.yourLinksDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {profile.links.map((link) => (
            <div key={link.id} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-secondary rounded-lg">
              <div className="cursor-move mt-3 hidden sm:block">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                <div className="flex items-center gap-2">
                  <IconPicker
                    value={link.icon}
                    onChange={(icon) => updateLink(link.id, "icon", icon)}
                  />
                  <Input
                    placeholder="Link Title"
                    value={link.title}
                    onChange={(e) => updateLink(link.id, "title", e.target.value)}
                  />
                </div>
                <Input
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 sm:gap-2 mt-3 flex-shrink-0">
                <Switch
                  checked={link.isActive}
                  onCheckedChange={(checked) => updateLink(link.id, "isActive", checked)}
                  className="scale-90 sm:scale-100"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLink(link.id)}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button onClick={addLink} className="w-full text-sm sm:text-base py-2 sm:py-3">
            <Plus className="h-4 w-4 mr-2" />
            {t("links.addLink")}
          </Button>
        </CardContent>
      </Card>

      {/* Save Changes Button */}
      <div className="flex justify-center pt-4">
        <Button onClick={saveChanges} variant="outline" className="gap-2">
          <Save className="h-4 w-4" />
          {t("common.saveChanges")}
        </Button>
      </div>
    </div>
  );
};

export default LinksTab;
