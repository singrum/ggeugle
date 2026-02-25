import { BookIcon, FolderIcon } from "@phosphor-icons/react";
import { matchPath, NavLink, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const sidebarItems = [
  { name: "기본 룰", path: "/home/sample", iconName: BookIcon },
  { name: "룰 보관함", path: "/home/storage", iconName: FolderIcon },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="h-full w-64 px-4 py-4 space-y-2">
      {sidebarItems.map((item) => {
        // 1. 기본적으로 현재 경로가 item.path로 시작하는지 확인
        const isExactMatch = matchPath(
          { path: item.path, end: false },
          pathname,
        );
        const isHomeDefault =
          (pathname === "/home" || pathname === "/home/") &&
          item.path === "/home/sample";

        const isActive = isExactMatch || isHomeDefault;

        return (
          <div key={item.path}>
            <Button
              asChild
              // isActive가 true일 때만 secondary-flat 적용
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
