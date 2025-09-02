import { navInfo } from "@/constants/sidebar";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import ThemeSettings from "@/app/more/theme-settings";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function MoreNavDropdownTrigger({
  children,
  dropdownContentAttr,
}: {
  children: ReactNode;
  dropdownContentAttr?: React.ComponentProps<
    typeof DropdownMenuPrimitive.Content
  >;
}) {
  const moreNavs = navInfo.filter(({ isMore }) => isMore);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="top" className="mr-4" {...dropdownContentAttr}>
        <div className="p-0.5">
          <ThemeSettings />
        </div>
        <DropdownMenuSeparator />
        {moreNavs.map(({ title, icon: Icon, key }) => (
          <NavLink to={`/${key}`} end key={key}>
            <DropdownMenuItem key={key} className="cursor-pointer gap-3 p-3">
              <Icon className="stroke-foreground size-5" />
              <span className="text-base font-medium">{title}</span>
            </DropdownMenuItem>
          </NavLink>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
