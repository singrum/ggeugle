import React from "react";

export default function RulesViewDescription({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="text-balance text-sm">{children}</div>;
}
