import { navInfo } from "@/constants/sidebar";
import { useMenu } from "@/hooks/use-menu";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import MoreNavDropdownTrigger from "../more-nav-dropdown-trigger";
import MobileNavButton from "./mobile-nav-button";
export default function MobileNavBar() {
  const menu = useMenu();
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
            <MobileNavButton key={key} label={title} active={menu === key} />
          </NavLink>
        ))}

        <MoreNavDropdownTrigger>
          <MobileNavButton
            label={"더보기"}
            className="cursor-default"
            active={navInfo.find(({ key }) => key === menu)?.isMore}
          />
        </MoreNavDropdownTrigger>
      </nav>
    </div>
  );
}
