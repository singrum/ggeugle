import { Card } from "@/components/ui/card";
import type React from "react";

export default function ExceptedWordsInputContainer({
  children,
}: React.ComponentProps<"div">) {
  return (
    <div className="relative mb-2 flex items-center px-4 md:px-6">
      <Card className="bg-muted flex w-full flex-col justify-end gap-0 rounded-xl py-0">
        {children}
      </Card>
    </div>
  );
}
