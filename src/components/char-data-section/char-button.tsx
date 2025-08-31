import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NodeType } from "@/lib/wordchain/graph/graph";
import { useWcStore } from "@/stores/wc-store";
import type React from "react";

export default function CharButton({
  className,
  children,
  size,
  variant,
}: {
  size?: "sm" | "default";
  variant?: NodeType | "default";
} & React.ComponentProps<"button">) {
  const search = useWcStore((e) => e.search);

  const buttonColorVariant = {
    default: "text-foreground hover:text-foreground",
    win: "text-win hover:text-win",
    lose: "text-lose hover:text-lose",
    route: "text-route hover:text-route",
    loopwin: "text-loopwin hover:text-loopwin",
  };
  size ??= "default";
  return (
    <Button
      variant={"ghost"}
      className={cn(
        "size-8 items-center justify-center text-base font-normal hover:font-medium",
        buttonColorVariant[variant ?? "default"],
        { "text-xs": size === "sm" },
        className,
      )}
      onClick={() => {
        search(children as string);
      }}
    >
      {children}
    </Button>
  );
}
