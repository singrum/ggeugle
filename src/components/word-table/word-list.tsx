import { pageSizeInfo } from "@/constants/search";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import type { MoveRow } from "@/types/search";
import { Minus } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { PaginationSimple } from "../ui/pagination-simple";
import { Separator } from "../ui/separator";

export default function WordList({ rows }: { rows: MoveRow[] }) {
  const [page, setPage] = useState(1);
  const pageSize = useWcStore((e) => e.pageSize);

  const totalPages = Math.ceil(rows.length / pageSizeInfo[pageSize].value);
  const start = (page - 1) * pageSizeInfo[pageSize].value;
  const currentRows = rows.slice(start, start + pageSizeInfo[pageSize].value);

  const addExceptedWord = useWcStore((e) => e.addExceptedWord);
  const search = useWcStore((e) => e.search);
  const autoSearch = useWcStore((e) => e.autoSearch);
  return (
    <div className="flex flex-col gap-4">
      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      <div className="flex flex-wrap items-center justify-center gap-1 py-2">
        {currentRows.map((moveRow: MoveRow) =>
          moveRow.words.map((e) => (
            <div
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "sm",
                }),
                "flex h-auto gap-0 px-0 py-0",
              )}
            >
              <div className="tracking-wider">
                {e.split("").map((char, i) => (
                  <Button
                    key={i}
                    onClick={() => {
                      search(char);
                    }}
                    className={cn(
                      "hover:text-muted-foreground h-8 p-0 hover:bg-transparent dark:hover:bg-transparent",
                      {
                        "pl-2.5": i === 0,
                        "pr-2": i === e.length - 1,
                      },
                    )}
                    variant={"ghost"}
                  >
                    {char}
                  </Button>
                ))}
              </div>
              <Separator
                className="bg-background h-8!"
                orientation="vertical"
              />
              <Button
                variant="ghost"
                size="sm"
                className="group/except-button pl-2!"
                onClick={() => {
                  addExceptedWord(e);
                  if (autoSearch) {
                    search(moveRow.move[1]);
                  }
                }}
              >
                <Minus className="stroke-muted-foreground group-hover/except-button:stroke-foreground size-4" />
              </Button>
            </div>
          )),
        )}
      </div>

      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
