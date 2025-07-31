import { Button } from "@/components/ui/button";
import { charMenuInfo } from "@/constants/search";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import type React from "react";

export default function CharMenu({ className }: React.ComponentProps<"div">) {
  const charMenu = useWcStore((e) => e.charMenu);
  const setCharMenu = useWcStore((e) => e.setCharMenu);

  return (
    <div className={cn("sticky top-0 z-10 px-6 pt-4 pb-0", className)}>
      <div
        className={cn(
          "bg-muted dark:bg-muted/50 supports-[backdrop-filter]:bg-muted/50 grid grid-cols-4 rounded-full border p-1 shadow-sm backdrop-blur-lg",
        )}
      >
        {charMenuInfo.map(({ title, key }, i) => (
          <div key={key} className="relative">
            <CharMenuButton
              className={cn("w-full rounded-full")}
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
      active:
        "text-win hover:text-win bg-win/10 hover:bg-win/10 dark:hover:bg-win/10",
    },
    lose: {
      active:
        "text-lose hover:text-lose bg-lose/10 hover:bg-lose/10 dark:hover:bg-lose/10",
    },
    loopwin: {
      active:
        "text-loopwin hover:text-loopwin bg-loopwin/10 hover:bg-loopwin/10 dark:hover:bg-loopwin/10",
    },
    route: {
      active:
        "text-route hover:text-route bg-route/10 hover:bg-route/10 dark:hover:bg-route/10",
    },
  };

  return (
    <Button
      variant={"ghost"}
      className={cn(
        "text-muted-foreground hover:text-muted-foreground h-10",

        { [colorVariants[color].active]: active },
        className,
      )}
      {...props}
    >
      {children}
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
      route: "bg-route",
    };

  return (
    <div
      className={cn(
        "absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full",

        colorVariants[color],
        className,
      )}
    />
  );
}
