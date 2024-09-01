import React from "react";
import { MenuBtn } from "./NavBar";
import { Code, Database, Github, History, Settings } from "lucide-react";
import { RiMoreFill } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export const etcMenu = [
  {
    name: "환경 설정",
    icon: <Settings className="md:h-4 md:w-4" />,
    onClick_: () => {
      document.getElementById("preference-setting-dialog-trigger")?.click();
    },
  },

  {
    name: "이전 버전",
    icon: <History className="md:h-4 md:w-4" />,
    onClick_: () => {
      open("https://singrum.github.io/ggeugle-old");
    },
  },
  {
    name: "깃허브",
    icon: <Github className="md:h-4 md:w-4" />,
    onClick_: () => {
      open("https://github.com/singrum/ggeugle");
    },
  },
  {
    name: "DB 출처",
    icon: <Database className="md:h-4 md:w-4" />,
    onClick_: () => {
      document.getElementById("db-dialog-trigger")?.click();
    },
  },
];

export function EtcNavBar() {
  return (
    <>
      <div className="w-auto flex md:flex-col items-center justify-around text-muted-foreground/70 md:text-muted-foreground bg-background border-t border-border md:border-none md:relative z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MenuBtn
              icon={<RiMoreFill className="w-6 h-6 md:w-5 md:h-5" />}
              name={"더 보기"}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {etcMenu.map(({ icon, name, onClick_ }) => (
              <DropdownMenuItem onClick={onClick_}>
                <div>{icon}</div>
                <div>{name}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
