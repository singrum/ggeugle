import { navInfo } from "@/constants/sidebar";
import { useMenu } from "@/hooks/use-menu";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import MoreNavDropdownTrigger from "../more-nav-dropdown-trigger";
import NavButton from "../sidebar/nav-button";
export default function MobileBottomBar() {
  const menu = useMenu();
  const location = useLocation();

  const navs = navInfo.filter(({ isMore }) => !isMore);

  return (
    <div className={cn("bg-sidebar fixed bottom-0 z-50 h-16 w-full shrink-0")}>
      <nav
        className={cn("mx-auto grid h-full max-w-lg grid-cols-4 items-center")}
      >
        {navs.map(({ title, icon, key, isMore }) => (
          <NavLink
            to={`/${key}` + (!isMore ? `${location.search}` : "")}
            end
            key={key}
          >
            <NavButton
              Icon={icon}
              key={key}
              label={title}
              active={menu === key}
            />
          </NavLink>
        ))}

        <MoreNavDropdownTrigger>
          <NavButton
            Icon={MoreHorizontal}
            label={"더 보기"}
            className="cursor-default"
          />
        </MoreNavDropdownTrigger>
      </nav>
    </div>
  );
}
