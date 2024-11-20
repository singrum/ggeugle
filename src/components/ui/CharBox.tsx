import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "./badge";

import { useSheet } from "@/lib/store/useSheet";
import { useWC } from "@/lib/store/useWC";

export function CharBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 items-center pt-2", className)}>
      {children}
    </div>
  );
}

export function CharBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="text-muted-foreground text-xs" variant={"secondary"}>
      {children}
    </Badge>
  );
}
export function CharContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex justify-center w-full">
      <div
        className={cn(
          "flex flex-wrap gap-x-1 gap-y-1 text-xl justify-center",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
export function CharButton({
  children,
  className,
  type,
}: {
  children: string;
  className?: string;
  type: string;
}) {
  const setValue = useWC((e) => e.setValue);
  const setSearchInputValue = useWC((e) => e.setSearchInputValue);
  const changeInfo = useWC((e) => e.changeInfo);
  const [sheetRef, setOpen] = useSheet((e) => [e.sheetRef, e.setOpen]);
  return (
    <div
      className={cn(
        `relative h-9 w-9 flex items-center justify-center transition-all duration-75 cursor-pointer prevent-select hover:scale-150 text-${type} font-medium`,
        className
      )}
      onClick={() => {
        if (sheetRef.current && sheetRef.current.height > 600) {
          setOpen(false);
        }
        setValue(children);
        setSearchInputValue(children);
      }}
    >
      {changeInfo.compPrev[children] && (
        <div
          className={`absolute h-[7px] w-[7px] bg-${type} top-1 left-1 rounded-full`}
        />
      )}

      {children}
    </div>
  );
}
