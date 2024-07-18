import React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { useSearch } from "@/lib/store/useSearch";
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
    <Badge className="text-muted-foreground" variant={"secondary"}>
      {children}
    </Badge>
  );
}
export function CharContent({
  charInfo,
}: {
  charInfo: { char: string; type: string }[];
}) {
  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-wrap gap-x-1 gap-y-1 text-xl justify-center">
        {charInfo.map((e) => (
          <CharButton className={`text-${e.type}`} key={e.char}>
            {e.char}
          </CharButton>
        ))}
      </div>
    </div>
  );
}
export function CharButton({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const setValue = useSearch((e) => e.setValue);
  const worker = useWC((e) => e.worker);
  return (
    <div
      className={cn(
        "rounded-full h-9 w-9 flex items-center justify-center text-win transition-colors hover:bg-accent cursor-pointer prevent-select",
        className
      )}
      onClick={() => {
        worker?.postMessage({ action: "getWordClass", data: children });
        setValue(children);
      }}
    >
      {children}
    </div>
  );
}
