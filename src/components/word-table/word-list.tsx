import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import type { MoveRow } from "@/types/search";
import { Minus } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";

export default function WordList({ rows }: { rows: MoveRow[] }) {
  const addExceptedWord = useWcStore((e) => e.addExceptedWord);
  const search = useWcStore((e) => e.search);
  const autoSearch = useWcStore((e) => e.autoSearch);
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {rows.map((moveRow: MoveRow) =>
        moveRow.words.map((e) => (
          <div className="flex gap-[1.5px]">
            <div
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "sm",
                }),
                "h-auto items-center gap-0 rounded-l-4xl rounded-r-xs px-0!",
              )}
            >
              {e.split("").map((char, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    search(e);
                  }}
                  className={cn(
                    "hover:text-muted-foreground h-8 p-0 hover:bg-transparent dark:hover:bg-transparent",
                    {
                      "pl-3": i === 0,
                      "pr-2": i === e.length - 1,
                    },
                  )}
                  variant={"ghost"}
                >
                  {char}
                </Button>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-l-xs rounded-r-4xl pl-2!"
              onClick={() => {
                addExceptedWord(e);
                if (autoSearch) {
                  search(moveRow.move[1]);
                }
              }}
            >
              <Minus className="stroke-muted-foreground size-4" />
            </Button>
          </div>
        )),
      )}
    </div>
  );
}
