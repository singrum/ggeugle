import { BookIcon, FolderIcon } from "@phosphor-icons/react";
import { matchPath, NavLink, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const sidebarItems = [
  { name: "기본 룰", path: "/home/sample", iconName: BookIcon },
  { name: "보관함", path: "/home/storage", iconName: FolderIcon },
];

export default function MobileNav() {
  const { pathname } = useLocation();
  return (
    <div className="grid grid-cols-2 w-full bg-sidebar z-10 border-t sticky bottom-0 shadow-[0_500px_0_500px_var(--sidebar)]">
      {sidebarItems.map((item) => {
        const isExactMatch = matchPath(
          { path: item.path, end: false },
          pathname,
        );

        const isActive = isExactMatch;
        return (
          <div key={item.path}>
            <Button
              asChild
              variant={"ghost"}
              className={cn(
                "rounded-none w-full justify-start flex-col h-auto gap-1 py-2 hover:bg-transparent dark:hover:bg-transparent",
              )}
            >
              <NavLink to={item.path}>
                <div
                  className={cn("px-4 py-0.5 rounded-full bg-transparent", {
                    "bg-foreground/10": isActive,
                  })}
                >
                  <item.iconName
                    className={cn("size-6 shrink-0 text-muted-foreground", {
                      "text-foreground": isActive,
                    })}
                    weight={isActive ? "fill" : "regular"}
                  />
                </div>
                <div
                  className={cn("text-xs text-muted-foreground", {
                    "font-semibold text-foreground": isActive,
                  })}
                >
                  {item.name}
                </div>
              </NavLink>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
