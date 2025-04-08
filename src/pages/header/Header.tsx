import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { etcMenu } from "@/EtcNavBar";
import { cn } from "@/lib/utils";
import { Menu, Moon, SquareArrowOutUpRight, Sun, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

export default function Header({ className }: { className?: string }) {
  const [showAlert, setShowAlert] = useState(true);
  const theme = useTheme();
  const currTheme =
    theme.theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme.theme;
  return (
    <div className={cn("flex flex-col min-h-9 z-10", className)}>
      {showAlert && (
        <div
          className="text-xs flex justify-between text-[hsl(355.7,100%,97.3%)] bg-[hsl(142.1,76.2%,36.3%)] cursor-pointer font-semibold items-center"
          onClick={() => {
            setShowAlert(false);
          }}
        >
          {/* <div className=" rounded-md bg-white  px-1.5 py-0.5 text-xs leading-none text-[#5865F2]  no-underline group-hover:no-underline">
          New
        </div> */}
          <div className="p-1 invisible">
            <X className="w-4 h-4" />
          </div>
          <div
            className="flex  gap-1 items-center  p-1"
            onClick={(e) => {
              e.stopPropagation();
              open("https://ikki.app");
            }}
          >
            <SquareArrowOutUpRight className="h-3 w-3" strokeWidth="2.5" />
            끝말잇기 하러 가기
          </div>
          <div className="p-1">
            <X className="w-4 h-4" />
          </div>
        </div>
      )}
      <div className="flex w-full justify-between items-center border-b border-border h-14 p-1">
        <div
          className="flex items-end gap-1 px-3 py-2"
          onClick={() => {
            location.reload();
          }}
        >
          <Logo />
        </div>
        <div className="flex items-center pr-2 gap-2">
          <Button
            size="icon"
            variant={"ghost"}
            className="h-8 w-8 text-muted-foreground rounded-full"
            onClick={() => {
              theme.theme;
              theme.setTheme(currTheme === "dark" ? "light" : "dark");
            }}
          >
            {currTheme === "dark" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="w-8 h-8 text-muted-foreground rounded-full"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {etcMenu.map(({ name, icon, onClick_ }) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => {
                    onClick_();
                  }}
                >
                  {icon}
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
