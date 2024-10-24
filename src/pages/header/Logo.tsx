import { useTheme } from "@/components/theme-provider";
import DarkLogo from "/logo/dark.png";
import LightLogo from "/logo/light.png";
export default function Logo() {
  const theme = useTheme();
  const currTheme =
    theme.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme.theme;

  return (
    <div className="text-lg cursor-pointer flex gap-1 items-center md:flex-col md:gap-0 lg:gap-1 lg:flex-row lg:text-xl">
      {currTheme === "dark" ? (
        <img src={DarkLogo} alt="logo" className="max-w-5 md:max-w-6" />
      ) : (
        <img src={LightLogo} alt="logo" className="max-w-5 md:max-w-6" />
      )}

      <div className="font-semibold">끄글</div>
    </div>
  );
}
