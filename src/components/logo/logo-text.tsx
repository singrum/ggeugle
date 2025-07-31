import { cn } from "@/lib/utils";
import type React from "react";

export default function LogoText({ className }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-sidebar-foreground text-base font-semibold text-nowrap",
        className,
      )}
    >
      끄글
    </span>
  );
}
