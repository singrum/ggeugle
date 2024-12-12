import { useMediaQuery } from "@/hooks/use-media-query";
import { useRefs } from "@/lib/store/useRefs";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React from "react";
import { Badge } from "./badge";

export function WordBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:gap-5 items-center pt-4 pb-4 md:px-2 lg:px-4",
        className
      )}
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
  wordInfo: { word: string; type: string }[];
  endsWith?: boolean;
  notExcept?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center font-normal">
      {wordInfo.map((e) => (
        <WordButton
          className={`bg-${
            e.type === "return" ? "muted-foreground" : e.type
          }/10 text-${e.type === "return" ? "muted-foreground" : e.type}`}
          key={e.word}
          endsWith={endsWith}
          notExcept={notExcept}
          type={e.type}
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
  type,
}: {
  children: string;
  className?: string;

  notExcept?: boolean;
  endsWith?: boolean;
  type?: string;
}) {
  const [setExceptWords, exceptWords, setValue, engine, setSearchInputValue] =
    useWC((e) => [
      e.setExceptWords,
      e.exceptWords,
      e.setValue,
      e.engine,
      e.setSearchInputValue,
    ]);
  const inputRef = useRefs((e) => e.inputRef);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const head = children.at(engine!.rule.headIdx)!;
  const tail = children.at(engine!.rule.tailIdx)!;

  return (
    <button
      className={cn(
        "rounded-full flex items-center transition-colors text-background cursor-pointer",
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

        inputRef!.getBoundingClientRect().top < 0 && inputRef!.scrollIntoView();
      }}
    >
      <div className={cn("py-1 pl-3 pr-1 font-medium", { "pr-3": notExcept })}>
        {children}
      </div>

      {notExcept || (
        <>
          <div
            className="flex items-center justify-center rounded-full cursor-pointer py-1.5 pr-1.5 "
            onClick={() => {
              if (!exceptWords.includes(children)) {
                setExceptWords([...exceptWords, children]);
              }
            }}
          >
            <div
              className={`rounded-full w-5 h-5 flex items-center justify-center text-${type}`}
            >
              <div className="rounded-full text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground p-1 transition-colors">
                <X className={`w-3.5 h-3.5`} strokeWidth={3} />
              </div>
            </div>
          </div>
        </>
      )}
    </button>
  );
}
