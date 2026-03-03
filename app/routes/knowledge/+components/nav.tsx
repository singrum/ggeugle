import { matchPath, NavLink, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { content } from "~/constants/knowledge";
export default function Nav({ onItemClick }: { onItemClick?: () => void }) {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col gap-2">
      {content.map((item) => {
        if (item.type === "super") {
          return (
            <div key={item.title} className="space-y-2 py-2">
              <div className="text-sm text-muted-foreground px-4 h-9 font-medium flex items-center ">
                {item.title}
              </div>
              <div className=" flex flex-col gap-2">
                {item.items.map((subItem) => {
                  const isActive = matchPath(
                    `/knowledge/${encodeURIComponent(item.title)}/${encodeURIComponent(subItem.title)}/*`,
                    pathname,
                  );

                  return (
                    <Button
                      key={subItem.title}
                      className="w-full justify-start pl-8"
                      variant={isActive ? "secondary" : "ghost"}
                      asChild
                      onClick={onItemClick}
                    >
                      <NavLink to={`${item.title}/${subItem.title}`}>
                        {subItem.title}
                      </NavLink>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        } else {
          const isActive = matchPath(
            `/knowledge/${encodeURIComponent(item.title)}/*`,
            pathname,
          );
          return (
            <Button
              key={item.title}
              variant={isActive ? "secondary" : "ghost"}
              asChild
              className="w-full justify-start"
              onClick={onItemClick}
            >
              <NavLink to={item.title}>{item.title}</NavLink>
            </Button>
          );
        }
      })}
    </div>
  );
}
