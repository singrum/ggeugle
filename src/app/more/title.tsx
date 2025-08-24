import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";
import { Slash } from "lucide-react";
import IkkiLogoWhite from "/ikki-logo/ikki-green-dark.png";
import IkkiLogoBlack from "/ikki-logo/ikki-green-light.png";

const logoInfo: Record<"light" | "dark", string> = {
  dark: IkkiLogoWhite,
  light: IkkiLogoBlack,
};

export default function Title() {
  const { theme } = useTheme();
  const resolvedTheme: "dark" | "light" =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  return (
    <h1 className="flex items-center gap-2">
      <Button variant="link" asChild className="px-0">
        <a href={"https://ikki.app"} target="_blank" rel="noopener noreferrer">
          <img src={logoInfo[resolvedTheme]} className="w-12" alt="이끼" />
        </a>
      </Button>
      <Slash className="stroke-muted-foreground size-5 shrink-0 stroke-1" />
      <Button variant="link" asChild className="px-0">
        <a href="/">
          <div className="text-lg font-medium">끝말잇기 엔진</div>
        </a>
      </Button>
    </h1>
  );
}
