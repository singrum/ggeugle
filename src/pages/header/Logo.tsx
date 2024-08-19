import { Waypoints } from "lucide-react";
import DarkLogo from "/logo/dark.png";
import LightLogo from "/logo/light.png";
import { useTheme } from "@/components/theme-provider";
export default function Logo() {
  const theme = useTheme();
  const currTheme =
    theme.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme.theme;

  return (
    <div className="font-semibold text-lg ml-1 cursor-pointer flex gap-1 items-center md:flex-col md:gap-0 lg:gap-1 lg:flex-row">
      {currTheme === "dark" ? (
        <img src={DarkLogo} alt="logo" className="max-w-5" />
      ) : (
        <img src={LightLogo} alt="logo" className="max-w-5" />
      )}

      <div className="">끄글</div>
    </div>
  );
}
