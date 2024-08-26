import React, { ForwardedRef, forwardRef, ReactNode } from "react";
import { menus, useMenu } from "./lib/store/useMenu";
import { cn } from "./lib/utils";
export default function NavBar() {
  const setMenu = useMenu((e) => e.setMenu);
  const menu = useMenu((e) => e.menu);
  return (
    <>
      <div className="flex md:flex-col md:gap-2 lg:gap-0 items-center justify-around text-muted-foreground/70 md:text-muted-foreground bg-background border-t border-border md:border-none relative z-50">
        {menus.map((e, i) => (
          <MenuBtn
            key={i}
            icon={e.icon}
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
          "md:hover:text-foreground whitespace-nowrap w-full h-14 md:h-12 md:w-12 lg:w-[150px] lg:h-10 lg:p-3 flex flex-col lg:flex-row lg:gap-4 justify-center lg:justify-start items-center cursor-pointer rounded-lg p-1 transition-colors",
          className
        )}
      >
        {icon}
        <div className="text-[11px] lg:text-base select-none">{name}</div>
      </div>
    );
  }
);
