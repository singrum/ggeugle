import React, { ForwardedRef, forwardRef, ReactNode } from "react";
import { menus, useMenu } from "./lib/store/useMenu";
import { cn } from "./lib/utils";
export default function NavBar() {
  const [setMenu, menu] = useMenu((e) => [e.setMenu, e.menu]);

  return (
    <>
      <div className="fixed w-full md:w-auto bottom-0 flex md:flex-col gap-2 lg:gap-1 items-center justify-around text-muted-foreground/70 md:text-muted-foreground bg-background border-t border-border md:border-none md:relative z-50 h-14">
        {menus.map((e, i) => (
          <MenuBtn
            key={i}
            icon={e.icon}
            name={e.name}
            className={cn({
              "md:bg-accent text-foreground": i === menu,
            })}
            onClick={() => {
              setMenu(i);
            }}
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
          "lg:hover:bg-accent md:hover:text-foreground whitespace-nowrap w-full h-14 md:h-12 md:w-12 lg:w-[150px] lg:h-10 lg:p-3 flex flex-col lg:flex-row lg:gap-4 justify-center lg:justify-start items-center cursor-pointer rounded-lg p-1 transition-colors",
          className
        )}
      >
        {icon}
        <div className="text-[11px] lg:text-base select-none">{name}</div>
      </div>
    );
  }
);
