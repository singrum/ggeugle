import React from "react";

export default function RulesViewHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 sticky top-0 z-20 bg-background md:rounded-t-lg space-y-2">
      {children}
    </div>
  );
}
