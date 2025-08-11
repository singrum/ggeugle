import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import React from "react";

export function DownloadSection({ children }: React.ComponentProps<"div">) {
  return <div className="flex items-center justify-between">{children}</div>;
}

export function DownloadTitle({
  className,
  last,
  children,
}: { last?: boolean } & React.ComponentProps<"div">) {
  return (
    <div className="flex-1">
      <div className={cn("h-full p-5 text-base font-medium", className)}>
        {children}
      </div>

      <div className="px-4 sm:px-4">{!last && <Separator />}</div>
    </div>
  );
}

export function DownloadActionGroup({ children }: React.ComponentProps<"div">) {
  return <div className="flex gap-2 pr-4 sm:pr-6">{children}</div>;
}
export function DownloadActionButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  const isMobile = useIsMobile();
  return (
    <Button
      className={className}
      variant="secondary"
      {...props}
      size={isMobile ? "icon" : "default"}
    >
      {children}
    </Button>
  );
}
