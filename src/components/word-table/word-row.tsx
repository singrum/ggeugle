import { useWcStore } from "@/stores/wc-store";
import type { MoveRow } from "@/types/search";
import { Minus, MoveRight, Search } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import CharButton from "../char-data-section/char-button";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function WordRow({ data }: { data: MoveRow }) {
  const addExceptedWord = useWcStore((e) => e.addExceptedWord);
  const search = useWcStore((e) => e.search);
  const autoSearch = useWcStore((e) => e.autoSearch);
  return (
    <Card className="flex flex-row gap-4 rounded-[0.1rem] px-2 py-0 pr-1 first:rounded-t-lg last:rounded-b-lg">
      <div className="relative flex h-12 items-center">
        {[0, 1].map((e) => (
          <Fragment key={e}>
            <CharButton
              ghost
              variant={data.nodeTypes[e]}
              className="text-sm font-medium"
            >
              {data.move[e]}
            </CharButton>
            {e === 0 && (
              <MoveRight className="stroke-muted-foreground z-10 -mx-1.5 size-3" />
            )}
          </Fragment>
        ))}
      </div>
      <div className="flex-1">
        {data.words.map((e, i) => (
          <div key={e} className="flex min-h-12 items-center justify-between">
            <div className="spacing flex flex-1 items-center gap-2 py-2 text-base tracking-wider">
              {e}
              {data.pairs[i] && (
                <span className="text-muted-foreground font-normal">{`(${data.pairs[i]})`}</span>
              )}
            </div>
            <Button
              variant={"ghost"}
              size="icon"
              className="hover:bg-foreground/5 group size-10"
              onClick={() => {
                // evt.stopPropagation();
                search(e);
              }}
            >
              <Search className="stroke-muted-foreground group-hover:stroke-foreground transition-[stroke]" />
            </Button>
            <Button
              variant={"ghost"}
              size="icon"
              className="hover:bg-foreground/5 group size-10"
              onClick={() => {
                // evt.stopPropagation();
                addExceptedWord(e);
                if (autoSearch) {
                  search(data.move[1]);
                }
              }}
            >
              <Minus className="stroke-muted-foreground group-hover:stroke-foreground transition-[stroke]" />
            </Button>
          </div>
        ))}
        {/* {!last && <Separator />} */}
      </div>
    </Card>
  );
}
