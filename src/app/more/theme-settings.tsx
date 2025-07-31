import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

import { Laptop, Moon, Sun } from "lucide-react";

const info = [
  { title: "라이트", key: "light", icon: Sun },
  { title: "다크", key: "dark", icon: Moon },
  { title: "시스템", key: "system", icon: Laptop },
];

export default function ThemeSettings() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="space-y-2">
      {/* <div className="text-xs">테마 </div> */}
      <div className="grid w-fit grid-cols-3 rounded-full border">
        {info.map(({ key, icon: Icon }) => (
          <Button
            onClick={() => setTheme(key as "light" | "dark" | "system")}
            variant="ghost"
            className={cn("flex h-fit flex-col gap-2 rounded-full py-1", {
              "bg-accent dark:bg-accent/50": theme === key,
            })}
            key={key}
          >
            <Icon
              className={cn("size-4", {
                "stroke-accent-foreground": theme === key,
              })}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
