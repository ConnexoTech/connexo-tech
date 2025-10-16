import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Instagram, Globe, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Youtube, Github, Music, Camera, ShoppingBag, Heart, Link } from "lucide-react";

const ICONS = [
  { name: "instagram", Icon: Instagram },
  { name: "globe", Icon: Globe },
  { name: "mail", Icon: Mail },
  { name: "phone", Icon: Phone },
  { name: "map", Icon: MapPin },
  { name: "linkedin", Icon: Linkedin },
  { name: "twitter", Icon: Twitter },
  { name: "facebook", Icon: Facebook },
  { name: "youtube", Icon: Youtube },
  { name: "github", Icon: Github },
  { name: "music", Icon: Music },
  { name: "camera", Icon: Camera },
  { name: "shop", Icon: ShoppingBag },
  { name: "heart", Icon: Heart },
  { name: "link", Icon: Link },
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const selectedIcon = ICONS.find(i => i.name === value) || ICONS[ICONS.length - 1];
  const SelectedIconComponent = selectedIcon.Icon;

  const filteredIcons = ICONS.filter(icon =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SelectedIconComponent className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
          <DialogDescription>Select an icon for your link</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
            {filteredIcons.map(({ name, Icon }) => (
              <Button
                key={name}
                variant={value === name ? "default" : "outline"}
                size="icon"
                className="h-12 w-12"
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
              >
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IconPicker;
