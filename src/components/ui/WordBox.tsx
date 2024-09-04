import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { CirclePlus, Plus, RefreshCcw, RotateCcw, X } from "lucide-react";
import React from "react";
import { Badge } from "./badge";

import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { Separator } from "./separator";

export function WordBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 py-4 items-center ", className)}>
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
  wordInfo: { word: string; type: string }[];
  endsWith?: boolean;
  notExcept?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-x-1 gap-y-1 justify-center font-normal">
      {wordInfo.map((e) => (
        <WordButton
          className={`bg-${
            e.type === "return" ? "muted-foreground" : e.type
          }/10 text-${e.type === "return" ? "muted-foreground" : e.type}`}
          key={e.word}
          endsWith={endsWith}
          notExcept={notExcept}
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
  endsWith,
  notExcept,
}: {
  children: string;
  className?: string;

  notExcept?: boolean;
  endsWith?: boolean;
}) {
  const [setExceptWords, exceptWords, setValue, engine, setSearchInputValue] =
    useWC((e) => [
      e.setExceptWords,
      e.exceptWords,
      e.setValue,
      e.engine,
      e.setSearchInputValue,
    ]);

  const head = children.at(engine!.rule.headIdx)!;
  const tail = children.at(engine!.rule.tailIdx)!;

  return (
    <div
      className={cn(
        "rounded-full flex items-center transition-colors text-background cursor-pointer prevent-select",
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
      }}
    >
      <div className={cn("py-1 pl-3", { "pr-3": notExcept })}>{children}</div>

      {notExcept || (
        <div
          className="flex items-center justify-center rounded-full cursor-pointer py-2 pl-1.5 pr-2.5 "
          onClick={() => {
            if (!exceptWords.includes(children)) {
              setExceptWords([...exceptWords, children]);
            }
          }}
        >
          <CirclePlus className="w-4 h-4" strokeWidth={2.0} />
        </div>
      )}
    </div>
  );
}
