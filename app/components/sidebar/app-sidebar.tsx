"use client";

import { navInfo } from "~/constants/sidebar";

import { NavLink, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
export function AppSidebar() {
  const location = useLocation();

  const mainTabs = navInfo.filter((e) => !e.isMore);

  return (
    <div className="h-[calc(100svh-var(--header-height))] w-20 shrink-0 flex items-center justify-center flex-col gap-2">
      {mainTabs.map(({ title, icon, key }) => {
        const Icon = icon;
        const active = location.pathname.includes(key);
        return (
          <Button
            className={cn(
              "w-full group/nav text-muted-foreground hover:text-muted-foreground relative flex h-15 cursor-pointer flex-col gap-0 hover:bg-transparent hover:dark:bg-transparent",
            )}
            variant="ghost"
            asChild
            key={key}
          >
            <NavLink
              to={`${location.pathname.split("/").slice(0, -1).join("/")}/${key}`}
              end
              key={key}
            >
              {active && (
                <div className="bg-foreground absolute right-0 bottom-1 h-4/5 w-1 rounded-l-full" />
              )}

              <div
                className={cn(
                  "flex w-10 items-center justify-center rounded-full py-1 transition-colors",
                )}
              >
                <Icon
                  className={cn("text-muted-foreground size-6 lg:size-6", {
                    "text-foreground": active,
                  })}
                  weight={active ? "fill" : "regular"}
                />
              </div>
              <span
                className={cn("text-xs", {
                  "text-foreground": active,
                })}
              >
                {title}
              </span>
            </NavLink>
          </Button>
        );
      })}
    </div>
  );
}
