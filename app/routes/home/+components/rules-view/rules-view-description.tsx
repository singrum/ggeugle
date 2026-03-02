import React from "react";

export default function RulesViewDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-balance text-sm text-muted-foreground break-keep">
      {children}
    </div>
  );
}
