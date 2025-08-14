"use client";

import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { navInfo } from "@/constants/sidebar";
import { useMenu } from "@/hooks/use-menu";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import NavButton from "./nav-button";
export function AppSidebar() {
  const menu = useMenu();
  const location = useLocation();
  const innerSidebarComp = navInfo.find(
    (e) => e.key === menu,
  )!.innerSidebarComponent;
  const { setOpen } = useSidebar();
  useEffect(() => {
    if (menu === "info") {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [menu, setOpen]);

  return (
    <Sidebar
      collapsible="icon"
      className={cn("overflow-hidden *:data-[sidebar=sidebar]:flex-row", {
        "border-none": menu === "info",
      })}
    >
      <Sidebar
        collapsible="none"
        className="bg-sidebar w-[calc(var(--sidebar-width-icon)+1px)]! min-w-[calc(var(--sidebar-width-icon)+1px)]! border-0"
      >
        <SidebarContent className="items-center py-5">
          {navInfo.map(({ title, icon, key }) => (
            <NavLink
              to={
                `/${key}` +
                (!["knowledge", "info"].includes(key)
                  ? `${location.search}`
                  : "")
              }
              end
              key={key}
            >
              <NavButton
                Icon={icon}
                key={key}
                label={title}
                active={menu === key}
              />
            </NavLink>
          ))}
        </SidebarContent>
      </Sidebar>

      <Sidebar
        collapsible="none"
        className="bg-background min-w-0 flex-1 md:flex"
      >
        <SidebarContent>
          {innerSidebarComp && (
            <div className="no-scrollbar h-full overflow-auto">
              {innerSidebarComp}
            </div>
          )}
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
