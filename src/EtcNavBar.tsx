import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Database,
  Github,
  Settings,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa6";
import { RiMoreFill } from "react-icons/ri";
import { MenuBtn } from "./NavBar";
export const etcMenu = [
  {
    name: "환경 설정",
    icon: <Settings className="md:h-4 md:w-4" strokeWidth={1.5} />,
    onClick_: () => {
      document.getElementById("preference-setting-dialog-trigger")?.click();
    },
  },
  {
    name: "디스코드",
    icon: <FaDiscord className="h-6 w-6 md:h-4 md:w-4" strokeWidth={1.5} />,
    onClick_: () => {
      open("https://discord.gg/bkHgyajx89");
    },
  },
  {
    name: "구버전",
    icon: <SquareArrowOutUpRight className="md:h-4 md:w-4" strokeWidth={1.5} />,
    onClick_: () => {
      open("https://singrum.github.io/ggeugle-old");
    },
  },
  {
    name: "깃허브",
    icon: <Github className="md:h-4 md:w-4" strokeWidth={1.5} />,
    onClick_: () => {
      open("https://github.com/singrum/ggeugle");
    },
  },
  {
    name: "DB 출처",
    icon: <Database className="md:h-4 md:w-4" strokeWidth={1.5} />,
    onClick_: () => {
      document.getElementById("db-dialog-trigger")?.click();
    },
  },
];

export function EtcNavBar() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <div className="w-auto flex md:flex-col items-center justify-around text-muted-foreground/70 md:text-foreground bg-background border-t border-border md:border-none md:relative z-50">
        <DropdownMenu open={open} onOpenChange={(e) => setOpen(e)}>
          <DropdownMenuTrigger asChild>
            <MenuBtn
              icon={<RiMoreFill className="w-6 h-6 md:w-5 md:h-5" />}
              name={"더 보기"}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {etcMenu.map(({ icon, name, onClick_ }) => (
              <DropdownMenuItem
                onClick={() => {
                  setOpen(false);
                  onClick_();
                }}
                key={name}
              >
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
