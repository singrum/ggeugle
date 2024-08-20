import React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import { RefreshCcw, RotateCcw } from "lucide-react";
import { useWC } from "@/lib/store/useWC";

import { WCDisplay } from "@/lib/wc/wordChain";
import { useCookieSettings } from "@/lib/store/useCookieSettings";

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
    <Badge
      className="text-muted-foreground flex items-center gap-1"
      variant={"secondary"}
    >
      {children}
    </Badge>
  );
}
export function WordContent({
  wordInfo,
  endsWith,
  notExcept,
}: {
  wordInfo: { word: string; type: string; returning?: boolean }[];
  endsWith?: boolean;
  notExcept?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1 justify-center font-normal">
      {wordInfo.map((e) => (
        <WordButton
          className={`bg-${e.type}/10 text-${e.type}`}
          key={e.word}
          returning={e.returning}
          endsWith={endsWith}
          notExcept={true}
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

  endsWith,
  notExcept,
  loop,
}: {
  children: string;
  className?: string;
  returning?: boolean;
  notExcept?: boolean;
  endsWith?: boolean;
  loop?: boolean;
}) {
  const [setExceptWords, exceptWords, setValue, engine, setSearchInputValue] =
    useWC((e) => [
      e.setExceptWords,
      e.exceptWords,
      e.setValue,
      e.engine,
      e.setSearchInputValue,
    ]);
  const [isAutoExcept] = useCookieSettings((e) => [e.isAutoExcept]);
  const head = children.at(engine!.rule.headIdx)!;
  const tail = children.at(engine!.rule.tailIdx)!;
  return (
    <div
      className={cn(
        "rounded-full flex items-center transition-colors py-1 px-3 text-background cursor-pointer prevent-select gap-1 hover:font-semibold",
        className
      )}
      onClick={() => {
        if (!endsWith) {
          setValue(tail);
          setSearchInputValue(tail);
        } else {
          setValue(head);
          setSearchInputValue(head);
        }

        if (
          isAutoExcept &&
          !notExcept &&
          !endsWith &&
          !exceptWords.includes(children)
        ) {
          setExceptWords([...exceptWords, children]);
        }
      }}
    >
      <div>{children}</div>
      {returning && <RefreshCcw className="w-4 h-4" />}
      {loop === false &&
        !returning &&
        engine!.wordGraph.nodes[head].loop === tail && (
          <RotateCcw className="w-4 h-4" />
        )}
    </div>
  );
}
