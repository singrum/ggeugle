import { navInfo } from "@/constants/sidebar";
import { useMenu } from "@/hooks/use-menu";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import NavButton from "../sidebar/nav-button";

export default function MobileBottomBar() {
  const menu = useMenu();
  const location = useLocation();
  return (
    <div
      className={cn("bg-background fixed bottom-0 z-30 h-16 w-full shrink-0")}
    >
      <nav className={cn("mx-auto grid max-w-lg grid-cols-5 items-center")}>
        {navInfo.map(({ title, icon, key }) => (
          <NavLink
            to={`/${key}` + (key !== "knowledge" ? `${location.search}` : "")}
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
      </nav>
    </div>
  );
}
