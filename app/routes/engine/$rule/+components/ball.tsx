import type React from "react";
import { cn } from "~/lib/utils";

export function Ball({
  variant,
  className,
}: {
  variant: "win" | "lose" | "loopwin" | "route" | "removed" | "default";
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "size-2 shrink-0 rounded-full",
        {
          "bg-win": variant === "win",
          "bg-lose": variant === "lose",
          "bg-route": variant === "route",
          "bg-loopwin": variant === "loopwin",
          "bg-foreground/20": variant === "removed",
          "bg-foreground": variant === "default",
        },
        className,
      )}
    />
  );
}
