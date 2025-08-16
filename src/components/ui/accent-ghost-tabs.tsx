import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";
function AccentGhostTabs({
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

function AccentGhostTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("flex w-fit items-center justify-center gap-1", className)}
      {...props}
    />
  );
}

function AccentGhostTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <div className="relative">
      <TabsPrimitive.Trigger
        data-slot="tabs-trigger"
        className={cn(
          "text-muted-foreground hover:bg-accent dark:hover:bg-accent inline-flex w-fit items-center justify-center rounded-full bg-transparent px-4 py-2.5 text-sm leading-4 font-medium transition-colors",
          "data-[state=active]:text-accent-foreground data-[state=active]:bg-accent dark:hover:data-[state=active]:bg-accent",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function AccentGhostTabsContent({
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

export {
  AccentGhostTabs,
  AccentGhostTabsContent,
  AccentGhostTabsList,
  AccentGhostTabsTrigger,
};
