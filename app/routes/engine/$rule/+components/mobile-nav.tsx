import { NavLink, useLocation, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { navInfo } from "~/constants/sidebar";
import { cn } from "~/lib/utils";

export default function MobileNav() {
  const { pathname } = useLocation();
  const { rule } = useParams();

  const pathSegments = pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  return (
    <div className="grid grid-cols-2 w-full  bg-sidebar z-10 border-t dark:border-0">
      {navInfo.map((item) => {
        const isExactMatch = lastSegment === item.key;
        const isActive = isExactMatch;
        return (
          <div key={item.key}>
            <Button
              asChild
              variant={"ghost"}
              className={cn(
                "rounded-none w-full justify-start flex-col h-auto  gap-1 py-2",
              )}
            >
              <NavLink to={`/engine/${encodeURIComponent(rule!)}/${item.key}`}>
                <div
                  className={cn("px-5 py-0.5 rounded-full bg-transparent", {
                    "bg-primary": isActive,
                  })}
                >
                  <item.icon
                    className={cn("size-6 shrink-0 text-muted-foreground", {
                      "text-primary-foreground": isActive,
                    })}
                    weight={isActive ? "fill" : "regular"}
                  />
                </div>
                <div
                  className={cn(" text-xs text-muted-foreground", {
                    "text-sidebar-foreground": isActive,
                  })}
                >
                  {item.title}
                </div>
              </NavLink>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
