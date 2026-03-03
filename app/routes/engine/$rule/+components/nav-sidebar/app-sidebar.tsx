"use client";

import { navInfo } from "~/constants/sidebar";

import { NavLink, useLocation, useParams } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "../../../../../components/ui/button";
export function AppSidebar() {
  const { pathname } = useLocation();
  const { rule } = useParams();
  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  return (
    <div className="h-[calc(100svh-var(--header-height))] w-20 shrink-0 flex items-center justify-center flex-col gap-2">
      {navInfo.map((item) => {
        const isExactMatch = lastSegment === item.key;
        const isActive = isExactMatch;
        return (
          <Button
            asChild
            variant={"ghost"}
            className={cn(
              "rounded-none w-full justify-start flex-col h-auto  gap-1 py-2 hover:bg-transparent dark:hover:bg-transparent",
            )}
            key={item.key}
          >
            <NavLink to={`/engine/${encodeURIComponent(rule!)}/${item.key}`}>
              <div
                className={cn("px-4 py-0.5 rounded-full bg-transparent", {
                  "bg-primary/10": isActive,
                })}
              >
                <item.icon
                  className={cn("size-6 shrink-0 text-muted-foreground", {
                    "text-primary": isActive,
                  })}
                  weight={isActive ? "fill" : "regular"}
                />
              </div>
              <div
                className={cn("text-xs text-muted-foreground", {
                  "font-semibold text-sidebar-foreground": isActive,
                })}
              >
                {item.title}
              </div>
            </NavLink>
          </Button>
        );
      })}
    </div>
  );
}
