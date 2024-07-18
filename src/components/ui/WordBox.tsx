import React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useWC } from "@/lib/store/useWC";
import { useSearch } from "@/lib/store/useSearch";

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
          className={`border border-${e.type}/40 text-${e.type} hover:border-${e.type}`}
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
  const worker = useWC((e) => e.worker);
  const setExceptWords = useSearch((e) => e.setExceptWords);
  const exceptWords = useSearch((e) => e.exceptWords);
  const setValue = useSearch((e) => e.setValue);
  const rule = useWC((e) => e.rule);
  return (
    <div
      className={cn(
        "rounded-full flex items-center transition-colors py-1 px-3 text-background cursor-pointer prevent-select",
        className
      )}
      onClick={() => {
        setExceptWords([...exceptWords, children]);
        worker!.postMessage({
          action: "setWords",
          data: { words: [children], operation: "remove", autoSearch: true },
        });
        const tail_index =
          rule.tailDir === 0 ? rule.tailIdx - 1 : -rule.tailIdx;
        const tail =
          children[tail_index >= 0 ? tail_index : children.length + tail_index];
        setValue(tail);
      }}
    >
      <div>{children}</div>
      {returning && <RefreshCcw className="w-4 h-4" />}
    </div>
  );
}
