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
    <div className="grid grid-cols-2 w-full bg-sidebar z-40 border-t dark:border-0 sticky bottom-0 shadow-[0_500px_0_500px_var(--sidebar)] lg:hidden">
      {navInfo.map((item) => {
        const isExactMatch = lastSegment === item.key;
        const isActive = isExactMatch;
        return (
          <div key={item.key}>
            <Button
              asChild
              variant={"ghost"}
              className={cn(
                "rounded-none w-full justify-start flex-col h-auto  gap-1 py-2 hover:bg-transparent dark:hover:bg-transparent",
              )}
            >
              <NavLink to={`/engine/${encodeURIComponent(rule!)}/${item.key}`}>
                <div
                  className={cn("px-4 py-0.5 rounded-full bg-transparent", {
                    "bg-foreground/10": isActive,
                  })}
                >
                  <item.icon
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
