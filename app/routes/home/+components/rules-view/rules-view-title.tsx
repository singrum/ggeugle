import React from "react";

export default function RulesViewTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="text-xl font-bold mb-6">{children}</h1>;
}
