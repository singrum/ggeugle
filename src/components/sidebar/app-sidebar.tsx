"use client";

import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { navInfo } from "@/constants/sidebar";
import { useMenu } from "@/hooks/use-menu";
import { cn } from "@/lib/utils";
import { Fragment, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";
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

  return (
    <Sidebar
      collapsible="icon"
      className={cn("overflow-hidden *:data-[sidebar=sidebar]:flex-row", {
        "border-none": !navInfo.find((e) => e.key === menu)
          ?.innerSidebarComponent,
      })}
    >
      <Sidebar
        collapsible="none"
        className="bg-sidebar w-[calc(var(--sidebar-width-icon)+1px)]! min-w-[calc(var(--sidebar-width-icon)+1px)]! border-0"
      >
        <SidebarContent className="items-center py-5">
          {[
            navInfo.filter((e) => !e.isMore),
            navInfo.filter((e) => e.isMore),
          ].map((e, i) => (
            <Fragment key={e[0].key}>
              {e.map(({ title, icon, key, isMore }) => (
                <NavLink
                  to={`/${key}` + (!isMore ? `${location.search}` : "")}
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
              {i === 0 ? (
                <div className="my-2 w-full px-4">
                  <Separator />
                </div>
              ) : null}
            </Fragment>
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
