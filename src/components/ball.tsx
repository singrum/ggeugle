import { cn } from "@/lib/utils";
import type React from "react";

export function Ball({
  variant,
  className,
}: {
  variant: "win" | "lose" | "loopwin" | "route" | "removed";
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "size-2 rounded-full",
        {
          "bg-win": variant === "win",
          "bg-lose": variant === "lose",
          "bg-route": variant === "route",
          "bg-loopwin": variant === "loopwin",
          "bg-foreground/20": variant === "removed",
        },
        className,
      )}
    />
  );
}
