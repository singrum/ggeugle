import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function SettingMenu({
  name,
  description,
  className,
  children,
}: {
  name: string;
  description?: string | ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 py-4 bg-background min-w-0",
        className
      )}
    >
      <div>
        <div className="text-base font-semibold">{name}</div>
        <div className="text-xs text-muted-foreground my-1">{description}</div>
      </div>

      {children}
    </div>
  );
}
