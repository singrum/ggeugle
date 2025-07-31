import type React from "react";
import { Badge } from "../ui/badge";

export default function WordsListLabel({
  children,
}: React.ComponentProps<"div">) {
  return (
    <Badge variant="secondary" className="text-xs">
      {children}
    </Badge>
  );
}
