import { navInfo } from "~/constants/sidebar";

import { cn } from "~/lib/utils";

import { NavLink, useLocation } from "react-router";
import MobileNavButton from "./mobile-nav-button";
export default function MobileNavBar() {
  const location = useLocation();

  const navs = navInfo.filter(({ isMore }) => !isMore);

  return (
    <div className={cn("flex w-full shrink-0 items-center")}>
      <nav
        className={cn(
          "mx-auto grid h-full w-full max-w-xl grid-cols-4 items-center",
        )}
      >
        {navs.map(({ title, key, isMore }) => (
          <NavLink
            className="h-full"
            to={`/${key}` + (!isMore ? `${location.search}` : "")}
            end
            key={key}
          >
            <MobileNavButton
              key={key}
              label={title}
              active={location.pathname.includes(key)}
            />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
