import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";
function LineTabs({
  className,
  children,
  ...props
}: { gradient?: boolean } & React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        "relative flex flex-col px-6 shadow-[inset_0_-1px_0_0_var(--border)]",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
}
function LineTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("flex w-fit items-center justify-center", className)}
      {...props}
    />
  );
}

function LineTabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <div className="relative">
      <TabsPrimitive.Trigger
        data-slot="tabs-trigger"
        className={cn(
          "group hover:text-accent-foreground text-muted-foreground inline-flex w-fit flex-col items-center justify-center rounded-none bg-transparent text-sm leading-4 font-medium transition-all",
          "data-[state=active]:text-foreground",
          className,
        )}
        {...props}
      >
        <div className="rounded-lg px-3 py-4 transition-all">{children}</div>
        <div className="h-[3px] w-full px-3">
          <div className="group-data-[state=active]:bg-foreground h-[3px] w-full rounded-full transition-colors" />
        </div>
      </TabsPrimitive.Trigger>
    </div>
  );
}

function LineTabsContent({
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

export { LineTabs, LineTabsContent, LineTabsList, LineTabsTrigger };
