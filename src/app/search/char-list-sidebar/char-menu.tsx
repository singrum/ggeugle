import { Button } from "@/components/ui/button";
import { charMenuInfo } from "@/constants/search";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import type React from "react";

export default function MobileCharMenu({
  className,
}: React.ComponentProps<"div">) {
  const charMenu = useWcStore((e) => e.charMenu);
  const setCharMenu = useWcStore((e) => e.setCharMenu);

  return (
    <div
      className={cn(
        "bg-background grid grid-cols-4 gap-1 rounded-full px-4 pt-0 lg:px-2 lg:pt-2",
        className,
      )}
    >
      {charMenuInfo.map(({ title, key }, i) => (
        <div key={key} className="relative">
          <CharMenuButton
            className={cn("w-full")}
            color={key}
            active={i === charMenu}
            onClick={() => {
              setCharMenu(i as 0 | 1 | 2);
            }}
          >
            {title}
          </CharMenuButton>
        </div>
      ))}
    </div>
  );
}

function CharMenuButton({
  className,
  color,
  active,
  children,
  ...props
}: {
  color: (typeof charMenuInfo)[number]["title"];
  active: boolean;
} & React.ComponentProps<"button">) {
  const colorVariants: Record<
    (typeof charMenuInfo)[number]["title"],
    { active: string }
  > = {
    win: {
      active: "text-win hover:text-win",
    },
    lose: {
      active: "text-lose hover:text-lose",
    },
    loopwin: {
      active: "text-loopwin hover:text-loopwin",
    },
    route: {
      active: "text-route hover:text-route",
    },
  };

  return (
    <Button
      variant={"ghost"}
      className={cn(
        "text-muted-foreground hover:text-muted-foreground h-12 rounded-lg tracking-wider",

        { [colorVariants[color].active]: active },
        className,
      )}
      {...props}
    >
      {children}
      {
        <BottomBar
          color={color}
          className={cn("w-0 opacity-0 transition-all", {
            "w-8 opacity-100": active,
          })}
        />
      }
    </Button>
  );
}

export function BottomBar({
  color,
  className,
}: { color: string } & React.ComponentProps<"div">) {
  const colorVariants: Record<(typeof charMenuInfo)[number]["title"], string> =
    {
      win: "bg-win",
      lose: "bg-lose",
      loopwin: "bg-loopwin",
      route: "bg-route",
    };

  return (
    <div
      className={cn(
        "absolute bottom-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full",

        colorVariants[color],
        className,
      )}
    />
  );
}
