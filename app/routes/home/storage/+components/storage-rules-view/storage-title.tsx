import React from "react";

export default function StorageTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="text-xl font-bold ">{children}</h1>;
}
