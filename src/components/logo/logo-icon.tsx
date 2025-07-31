import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import DarkLogo from "/logo/dark.png";
import LightLogo from "/logo/light.png";
export default function LogoIcon({ className }: React.ComponentProps<"div">) {
  const theme = useTheme();
  const currTheme =
    theme.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme.theme;
  return (
    <div className={cn("flex w-5 items-center justify-center", className)}>
      {currTheme === "dark" ? (
        <img src={DarkLogo} alt="logo" className="max-w-full" />
      ) : (
        <img src={LightLogo} alt="logo" className="max-w-full" />
      )}
    </div>
  );
}
