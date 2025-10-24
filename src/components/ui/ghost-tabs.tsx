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
      className={cn("flex w-fit items-center justify-center gap-2", className)}
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
          "hover:text-foreground text-muted-foreground inline-flex w-fit items-center justify-center rounded-lg bg-transparent px-2 py-3 text-base leading-4 font-medium transition-colors",
          "data-[state=active]:text-foreground",
          // "hover:bg-accent dark:hover:bg-accent/50 data-[state=active]:bg-accent dark:data-[state=active]:bg-accent/50",
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
