import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  themeColorInfo,
  type ThemeColor,
} from "@/constants/preference-settings";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function ColorSelectGroup() {
  const themeColors = useWcStore((e) => e.themeColors);

  return (
    <div className="flex gap-2">
      {themeColors.map((color, i) => (
        <ColorSelect key={i} value={color} onChange={() => {}} />
      ))}
    </div>
  );
}

function ColorSelect({
  onChange,
  value,
}: {
  onChange: (color: ThemeColor) => void;
  value: ThemeColor;
}) {
  const colorVariants: Record<ThemeColor, string> = {
    "theme-color-0": "bg-theme-color-0",
    "theme-color-1": "bg-theme-color-1",
    "theme-color-2": "bg-theme-color-2",
    "theme-color-3": "bg-theme-color-3",
    "theme-color-4": "bg-theme-color-4",
    "theme-color-5": "bg-theme-color-5",
    "theme-color-6": "bg-theme-color-6",
    "theme-color-7": "bg-theme-color-7",
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("border-none", colorVariants[value])} size="icon">
          Open
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(e) => onChange(e as ThemeColor)}
        >
          {themeColorInfo.map((e) => (
            <DropdownMenuRadioItem key={e.title} value={e.title}>
              {e.title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
