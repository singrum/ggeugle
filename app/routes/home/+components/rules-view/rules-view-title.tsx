import React from "react";

export default function RulesViewTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="text-xl lg:text-2xl font-semibold">{children}</h1>;
}
