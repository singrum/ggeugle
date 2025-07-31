import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type React from "react";

export function OutlineCard({
  children,
  className,
}: React.ComponentProps<"div">) {
  return (
    <Card className={cn("gap-8 border bg-transparent p-6 sm:p-6", className)}>
      {children}
    </Card>
  );
}
export function OutlineCardSection({ children }: React.ComponentProps<"div">) {
  return <div className="space-y-4">{children}</div>;
}
export function OutlineCardHeader({ children }: React.ComponentProps<"div">) {
  return (
    <CardHeader className="px-0">
      <CardTitle className="text-sm font-medium">{children}</CardTitle>
    </CardHeader>
  );
}

export function OutlineCardContent({
  children,
  className,
}: React.ComponentProps<"div">) {
  return (
    <CardContent className={cn("px-0", className)}>{children}</CardContent>
  );
}
