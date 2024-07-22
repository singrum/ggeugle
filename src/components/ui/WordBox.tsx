import React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useWC } from "@/lib/store/useWC";

import { WCDisplay } from "@/lib/wc/wordChain";

export function WordBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-3 py-2 items-center pt-2", className)}
    >
      {children}
    </div>
  );
}

export function WordBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="text-muted-foreground" variant={"secondary"}>
      {children}
    </Badge>
  );
}
export function WordContent({
  wordInfo,
}: {
  wordInfo: { word: string; type: string; returning?: boolean }[];
}) {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1 justify-center font-normal">
      {wordInfo.map((e) => (
        <WordButton
          className={`border border-${e.type}/30 text-${e.type} hover:border-${e.type} hover:bg-${e.type}/10`}
          key={e.word}
          returning={e.returning}
        >
          {e.word}
        </WordButton>
      ))}
    </div>
  );
}
export function WordButton({
  children,
  className,
  returning,
}: {
  children: string;
  className?: string;
  returning?: boolean;
}) {
  const setExceptWords = useWC((e) => e.setExceptWords);
  const exceptWords = useWC((e) => e.exceptWords);
  const setValue = useWC((e) => e.setValue);
  const engine = useWC((e) => e.engine);
  const setSearchInputValue = useWC((e) => e.setSearchInputValue);
  return (
    <div
      className={cn(
        "rounded-full flex items-center transition-colors py-1 px-3 text-background cursor-pointer prevent-select gap-1 hover:font-semibold",
        className
      )}
      onClick={() => {
        const tail = children.at(engine!.rule.tailIdx)!;
        setValue(tail);

        setSearchInputValue(tail);
        if (!exceptWords.includes(children)) {
          setExceptWords([...exceptWords, children]);
        }
      }}
    >
      <div>{children}</div>
      {returning && <RefreshCcw className="w-4 h-4" />}
    </div>
  );
}
