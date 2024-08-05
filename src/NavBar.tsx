import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ellipsis, History, Settings } from "lucide-react";
import React, { ForwardedRef, forwardRef, ReactNode, useState } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import { useTheme } from "./components/theme-provider";
import { Checkbox } from "./components/ui/checkbox";
import { Separator } from "./components/ui/separator";
import { useMediaQuery } from "./hooks/use-media-query";
import { menus, useMenu } from "./lib/store/useMenu";
import { cn } from "./lib/utils";
import { RuleSetting } from "./pages/body/setting/RuleSetting";
export default function NavBar() {
  const setMenu = useMenu((e) => e.setMenu);
  const menu = useMenu((e) => e.menu);
  // const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      <div className="flex md:flex-col gap-1 items-center justify-around bg-background border-t border-border md:border-none h-12 relative z-50">
        {menus.map((e, i) => (
          <MenuBtn
            key={i}
            icon={e.icon}
            name={e.name}
            className={cn({
              "md:bg-accent text-foreground": menu.index === e.index,
            })}
            onClick={() => setMenu(i)}
          />
        ))}
      </div>
    </>
  );
}

interface MenuBtnProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  name: string;
  className?: string;
}

export const MenuBtn = forwardRef(
  (
    { icon, name, className, ...props }: MenuBtnProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "w-full h-11 md:h-12 md:w-12 lg:w-[140px] lg:h-auto lg:p-2 flex flex-col lg:flex-row lg:gap-4 justify-center lg:justify-start items-center cursor-pointer text-muted-foreground lg:hover:text-foreground lg:hover:bg-accent rounded-lg p-1 transition-colors",
          className
        )}
      >
        {icon}
        <div className="text-[10px] lg:text-sm lg:text-foreground">{name}</div>
      </div>
    );
  }
);
