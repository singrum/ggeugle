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
    <div className="text-xl cursor-pointer flex gap-2 items-center md:flex-col md:gap-1 lg:gap-2 lg:flex-row lg:text-xl select-none">
      {currTheme === "dark" ? (
        <img
          src={DarkLogo}
          alt="logo"
          className="max-w-6 md:max-w-7 lg:max-w-6"
        />
      ) : (
        <img
          src={LightLogo}
          alt="logo"
          className="max-w-6 md:max-w-7 lg:max-w-6"
        />
      )}

      <div className="font-semibold">끄글</div>
    </div>
  );
}
