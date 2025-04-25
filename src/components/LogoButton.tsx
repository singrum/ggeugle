import { useMediaQuery } from "@/hooks/use-media-query";
import Logo from "@/pages/header/Logo";
import { ChevronsUpDown } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DarkLogo from "/logo/dark.png";
import ikkiLogo from "/logo/ikkiLogo.png";
import LightLogo from "/logo/light.png";

export default function LogoButton() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  const theme = useTheme();
  const currTheme =
    theme.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme.theme;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={isTablet && !isDesktop ? "icon" : "default"}
          className=" gap-4 w-fit md:w-full flex justify-between md:justify-center lg:justify-between md:h-12 lg:h-10 lg:px-2"
        >
          <div className="p-0">
            <Logo />
          </div>

          {(!isTablet || isDesktop) && (
            <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
        <DropdownMenuItem
          className="flex items-center"
          onClick={() => {
            location.reload();
          }}
        >
          {currTheme === "dark" ? (
            <img src={DarkLogo} alt="logo" className="max-w-6" />
          ) : (
            <img src={LightLogo} alt="logo" className="max-w-6" />
          )}
          <span className="text-base">끄글</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center"
          onClick={() => open("https://ikki.app")}
        >
          <img src={ikkiLogo} alt="logo" className="max-w-6" />
          <span className="text-base">이끼</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
