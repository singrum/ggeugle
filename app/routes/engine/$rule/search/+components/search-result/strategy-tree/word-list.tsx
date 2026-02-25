import React from "react";

export default function WordList({ children }: React.ComponentProps<"div">) {
  return <div className="relative flex flex-wrap gap-0">{children}</div>;
}
