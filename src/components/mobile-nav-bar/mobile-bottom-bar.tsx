import { navInfo } from "@/constants/sidebar";
import { useMenu } from "@/hooks/use-menu";
import { cn } from "@/lib/utils";
import { DotsThreeCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import NavButton from "../sidebar/nav-button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function MobileBottomBar() {
  const menu = useMenu();
  const location = useLocation();
  const moreNavs = navInfo.filter(({ isMore }) => isMore);
  const navs = navInfo.filter(({ isMore }) => !isMore);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={cn("bg-background fixed bottom-0 z-30 h-16 w-full shrink-0")}
    >
      <nav
        className={cn(
          "mx-auto grid max-w-lg grid-cols-4 items-center md:grid-cols-5",
        )}
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

        <Popover open={open} onOpenChange={(open) => setOpen(open)}>
          <PopoverTrigger asChild>
            <NavButton
              Icon={DotsThreeCircleIcon}
              label={"더 보기"}
              active={moreNavs.map(({ key }) => key).includes(menu)}
            />
          </PopoverTrigger>
          <PopoverContent className="flex w-fit gap-2 p-2">
            {moreNavs.map(({ title, icon, key, isMore }) => (
              <NavLink
                to={`/${key}` + (!isMore ? `${location.search}` : "")}
                end
                key={key}
                onClick={() => setOpen(false)}
              >
                <NavButton
                  Icon={icon}
                  key={key}
                  label={title}
                  active={menu === key}
                />
              </NavLink>
            ))}
          </PopoverContent>
        </Popover>
      </nav>
    </div>
  );
}
