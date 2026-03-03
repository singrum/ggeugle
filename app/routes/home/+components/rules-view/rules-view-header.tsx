import React from "react";

export default function RulesViewHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-6 pb-0 space-y-2">{children}</div>;
}
