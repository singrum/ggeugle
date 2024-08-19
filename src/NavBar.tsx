import React, { ForwardedRef, forwardRef, ReactNode } from "react";
import { menus, useMenu } from "./lib/store/useMenu";
import { cn } from "./lib/utils";
export default function NavBar() {
  const setMenu = useMenu((e) => e.setMenu);
  const menu = useMenu((e) => e.menu);
  return (
    <>
      <div className="flex md:flex-col gap-1 items-center justify-around bg-background border-t border-border md:border-none relative z-50">
        {menus.map((e, i) => (
          <MenuBtn
            key={i}
            icon={menu.index === e.index ? e.focusedIcon : e.icon}
            name={e.name}
            className={cn({
              "md:bg-accent text-foreground": menu.index === e.index,
            })}
            onClick={() => setMenu(i)}
          />
        ))}
      </div>
    </>
  );
}

interface MenuBtnProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  name: string;
  className?: string;
}

export const MenuBtn = forwardRef(
  (
    { icon, name, className, ...props }: MenuBtnProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "whitespace-nowrap w-full h-12 md:h-12 md:w-12 lg:w-[140px] lg:h-auto lg:p-2 flex flex-col lg:flex-row lg:gap-4 justify-center lg:justify-start items-center cursor-pointer text-muted-foreground lg:hover:text-foreground lg:hover:bg-accent rounded-lg p-1 transition-colors",
          className
        )}
      >
        {icon}
        <div className="text-[10px] lg:text-sm lg:text-foreground select-none">
          {name}
        </div>
      </div>
    );
  }
);
