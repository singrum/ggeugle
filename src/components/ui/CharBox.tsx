import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "./badge";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useRefs } from "@/lib/store/useRefs";
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
  const inputRef = useRefs((e) => e.inputRef);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <button
      className={cn(
        `relative h-9 w-9 flex items-center justify-center transition-all duration-75 cursor-pointer hover:scale-150 text-${type} font-medium`,
        className
      )}
      onClick={() => {
        if (sheetRef.current && sheetRef.current.height > 600) {
          setOpen(false);
        }
        setValue(children);
        setSearchInputValue(children);

        isDesktop
          ? inputRef!.getBoundingClientRect().top < 0 &&
            inputRef!.scrollIntoView({ behavior: "smooth", block: "start" })
          : inputRef!.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {changeInfo.compPrev[children] && (
        <div
          className={`absolute h-[7px] w-[7px] bg-${type} top-1 left-1 rounded-full`}
        />
      )}

      {children}
    </button>
  );
}
