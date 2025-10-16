import { useState } from "react";
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
import { linkSchema } from "@/lib/validations";

const LinksTab = () => {
  const { t } = useLanguage();
  const { profile, links, updateProfile, updateLinks } = useProfile();
  const { toast } = useToast();
  const [localLinks, setLocalLinks] = useState<Link[]>(links);
  const [contactEmail, setContactEmail] = useState(profile?.contact_email || "");
  const [contactPhone, setContactPhone] = useState(profile?.contact_phone || "");
  const [contactLocation, setContactLocation] = useState(profile?.contact_location || "");

  const addLink = () => {
    const newLink: Link = {
      id: `temp_${Date.now()}`,
      title: "",
      url: "",
      icon_class: "link",
      is_active: true,
      display_order: localLinks.length,
    };
    setLocalLinks([...localLinks, newLink]);
  };

  const updateLink = (id: string, field: keyof Link, value: string | boolean | number) => {
    const newLinks = localLinks.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    setLocalLinks(newLinks);
  };

  const deleteLink = (id: string) => {
    const newLinks = localLinks.filter((link) => link.id !== id);
    setLocalLinks(newLinks);
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile?.title || ""}
EMAIL:${contactEmail}
TEL:${contactPhone}
ADR:;;${contactLocation};;;;
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveChanges = async () => {
    // Validate links with zod schema
    for (const link of localLinks) {
      if (link.title && link.url) {
        const result = linkSchema.safeParse({
          title: link.title,
          url: link.url,
          icon_class: link.icon_class
        });
        
        if (!result.success) {
          toast({
            title: t("common.error"),
            description: `${link.title}: ${result.error.errors[0].message}`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Update profile with contact data
    const { error: profileError } = await updateProfile({
      contact_email: contactEmail || null,
      contact_phone: contactPhone || null,
      contact_location: contactLocation || null,
    });

    if (profileError) {
      toast({
        title: t("common.error"),
        description: "Failed to update contact information",
        variant: "destructive",
      });
      return;
    }

    // Update links
    const { error: linksError } = await updateLinks(localLinks);

    if (linksError) {
      toast({
        title: t("common.error"),
        description: "Failed to update links",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("common.success"),
      description: "Changes saved successfully",
    });
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

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
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("links.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">{t("links.location")}</Label>
            <Input
              id="location"
              placeholder="Caracas, Venezuela"
              value={contactLocation}
              onChange={(e) => setContactLocation(e.target.value)}
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
          {localLinks.map((link) => (
            <div key={link.id} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-secondary rounded-lg">
              <div className="cursor-move mt-3 hidden sm:block">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                <div className="flex items-center gap-2">
                  <IconPicker
                    value={link.icon_class}
                    onChange={(icon) => updateLink(link.id, "icon_class", icon)}
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
                  checked={link.is_active}
                  onCheckedChange={(checked) => updateLink(link.id, "is_active", checked)}
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
