import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";
function GhostTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function GhostTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex w-fit items-center justify-center gap-0.5",
        className,
      )}
      {...props}
    />
  );
}

function GhostTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <div className="relative">
      <TabsPrimitive.Trigger
        data-slot="tabs-trigger"
        className={cn(
          "hover:bg-accent dark:hover:bg-accent/50 text-muted-foreground inline-flex w-fit items-center justify-center rounded-lg bg-transparent px-3 py-3 text-sm leading-4 font-medium transition-colors",
          "data-[state=active]:text-foreground data-[state=active]:bg-accent dark:data-[state=active]:bg-accent/50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function GhostTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { GhostTabs, GhostTabsContent, GhostTabsList, GhostTabsTrigger };
