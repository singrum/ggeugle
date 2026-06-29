import React from "react";
import { cn } from "~/lib/utils";

export default function RulesViewHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6 pb-0 space-y-2", className)}>{children}</div>;
}
