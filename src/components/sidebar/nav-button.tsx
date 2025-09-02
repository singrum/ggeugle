import { cn } from "@/lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { Button } from "../ui/button";

export default function NavButton({
  Icon,
  label,
  className,
  active,
  ...props
}: {
  Icon: Icon;
  label: string;
  active?: boolean;
} & React.ComponentProps<"button">) {
  return (
    <Button
      className={cn(
        "group/nav text-muted-foreground hover:text-muted-foreground flex h-15 w-full cursor-pointer flex-col gap-0 hover:bg-transparent hover:dark:bg-transparent",

        className,
      )}
      variant="ghost"
      {...props}
    >
      <div
        className={cn(
          "flex w-10 items-center justify-center rounded-full py-1 transition-colors",
        )}
      >
        <Icon
          className={cn("text-muted-foreground size-6", {
            "text-foreground": active,
          })}
          weight={active ? "fill" : "regular"}
        />
      </div>
      <span
        className={cn("text-xs", {
          "text-foreground": active,
        })}
      >
        {label}
      </span>
    </Button>
  );
}
