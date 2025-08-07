import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type React from "react";

export default function WordButton({
  className,
  children,
  active,
  ...props
}: { active: boolean } & React.ComponentProps<"button">) {
  const button = (
    <Button
      variant={"ghost"}
      {...props}
      className={cn(
        "text-muted-foreground h-auto max-w-full px-3 py-2 text-left font-normal break-all whitespace-normal",
        { "text-foreground font-medium": active },
        className,
      )}
    >
      {children}
    </Button>
  );
  return button;
}
