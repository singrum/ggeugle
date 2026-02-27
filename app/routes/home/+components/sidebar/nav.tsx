import { BookIcon, FolderIcon } from "@phosphor-icons/react";
import { matchPath, NavLink, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const sidebarItems = [
  { name: "기본 룰", path: "/home/sample", iconName: BookIcon },
  { name: "보관함", path: "/home/storage", iconName: FolderIcon },
];

export default function Nav() {
  const { pathname } = useLocation();
  return (
    <div className="space-y-2 w-full flex-1 p-4 pt-0">
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
              variant={isActive ? "default" : "ghost"}
              className={cn("rounded-full w-full justify-start")}
            >
              <NavLink to={item.path}>
                <item.iconName
                  className="size-5 mr-2"
                  weight={isActive ? "regular" : "regular"}
                />
                {item.name}
              </NavLink>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
