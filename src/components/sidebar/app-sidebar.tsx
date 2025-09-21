"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navInfo } from "@/constants/sidebar";
import { useMenu } from "@/hooks/use-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import MoreNavDropdownTrigger from "../more-nav-dropdown-trigger";
import { Button } from "../ui/button";
import NavButton from "./nav-button";
export function AppSidebar() {
  const menu = useMenu();
  const location = useLocation();
  const innerSidebarComp = navInfo.find(
    (e) => e.key === menu,
  )!.innerSidebarComponent;
  const { setOpen } = useSidebar();
  useEffect(() => {
    if (!navInfo.find((e) => e.key === menu)?.innerSidebarComponent) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [menu, setOpen]);
  const mainTabs = navInfo.filter((e) => !e.isMore);

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "top-(--header-height) h-[calc(100svh-var(--header-height))]! overflow-hidden border-none *:data-[sidebar=sidebar]:flex-row",
        {
          "border-none": !navInfo.find((e) => e.key === menu)
            ?.innerSidebarComponent,
        },
      )}
    >
      <Sidebar
        collapsible="none"
        className="bg-sidebar w-[calc(var(--sidebar-width-icon)+1px)]! min-w-[calc(var(--sidebar-width-icon)+1px)]! border-0"
      >
        <SidebarContent className="items-center gap-2 py-5">
          {mainTabs.map(({ title, icon, key }) => (
            <NavLink to={`/${key}` + `${location.search}`} end key={key}>
              <NavButton
                Icon={icon}
                key={key}
                label={title}
                active={menu === key}
              />
            </NavLink>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center justify-center">
              <MoreNavDropdownTrigger
                dropdownContentAttr={{ side: "right", className: "mb-4" }}
              >
                <Button
                  variant={"ghost"}
                  size="icon"
                  className="hover:bg-sidebar-accent size-15"
                >
                  <MoreHorizontal className={cn("size-6")} />
                </Button>
              </MoreNavDropdownTrigger>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <Sidebar
        collapsible="none"
        className="bg-sidebar min-w-0 flex-1 pb-2 md:flex"
      >
        <SidebarContent className="bg-background rounded-l-lg">
          {innerSidebarComp && (
            <div className="no-scrollbar h-full overflow-y-scroll">
              {innerSidebarComp}
            </div>
          )}
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
