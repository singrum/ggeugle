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
        "text-muted-foreground px-3 font-normal",
        { "text-foreground font-medium": active },
        className,
      )}
    >
      {children}
    </Button>
  );
  return button;
}
