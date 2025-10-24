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
      className={cn("relative flex flex-col px-6", className)}
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
      className={cn(
        "flex w-fit items-center justify-center gap-6 px-2",
        className,
      )}
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
          "group hover:text-accent-foreground text-muted-foreground inline-flex w-fit flex-col items-center justify-center rounded-none border-b-2 border-transparent bg-transparent text-base leading-4 font-medium transition-all",
          "data-[state=active]:text-foreground data-[state=active]:border-foreground",
          className,
        )}
        {...props}
      >
        <div className="rounded-lg px-0 py-3 pb-3 transition-all">
          {children}
        </div>
        {/* <div className="h-[2px] w-full px-1">
          <div className="group-data-[state=active]:bg-foreground h-[2px] w-full transition-colors" />
        </div> */}
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
