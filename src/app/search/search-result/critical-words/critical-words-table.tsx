import { Ball } from "@/components/ball";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { NodeType, SingleMove } from "@/lib/wordchain/graph/graph";
import { useWcStore } from "@/stores/wc-store";
import type { CriticalWordInfo } from "@/types/search";
import { AnimatePresence, motion } from "framer-motion";
import { Minus } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

const DISPLAY_NUM = 3;
export default function CriticalWordsTable({
  data,
}: {
  data: { move: SingleMove; info: CriticalWordInfo }[];
}) {
  const search = useWcStore((e) => e.search);
  const addExceptedWord = useWcStore((e) => e.addExceptedWord);
  const autoSearch = useWcStore((e) => e.autoSearch);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>임계 단어</TableHead>

          <TableHead>제외 후 변화</TableHead>
          <TableHead className="text-center">제외</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {data.map(({ move, info: { word, difference } }) => (
            <motion.tr
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="data-[state=selected]:bg-muted relative border-b"
              key={word}
              layout
            >
              <TableCell>
                <Button
                  variant="link"
                  className="-mx-2 px-2"
                  onClick={() => search(word)}
                >
                  {word}
                </Button>
              </TableCell>

              <TableCell>
                {difference && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${difference.win.length}-${difference.lose.length}-${difference.loopwin.length}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="space-y-0">
                        {(["win", "lose", "loopwin"] as NodeType[]).map((e) => {
                          const arr =
                            difference[e as "win" | "lose" | "loopwin"];
                          const display_arr = arr.slice(0, DISPLAY_NUM);
                          return (
                            arr.length > 0 && (
                              <div className="flex items-center gap-1" key={e}>
                                <Ball variant={e} />
                                <div className="flex items-center">
                                  {display_arr.map((e, i) => (
                                    <Fragment key={e}>
                                      <Button
                                        variant="link"
                                        className="text-foreground w-fit px-1"
                                        onClick={() => {
                                          search(e);
                                        }}
                                      >
                                        {e}
                                      </Button>
                                      {display_arr.length - 1 !== i && (
                                        <span>,</span>
                                      )}
                                    </Fragment>
                                  ))}
                                  {arr.length > DISPLAY_NUM && (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant={"ghost"}
                                          size="sm"
                                          className="text-muted-foreground -mx-1 px-2 text-xs"
                                        >
                                          +{arr.length - DISPLAY_NUM}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="flex flex-wrap items-center">
                                        {arr.map((e) => (
                                          <Button
                                            onClick={() => {
                                              search(e);
                                            }}
                                            key={e}
                                            className="size-8"
                                            variant="ghost"
                                          >
                                            {e}
                                          </Button>
                                        ))}
                                      </PopoverContent>
                                    </Popover>
                                  )}
                                </div>
                              </div>
                            )
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    addExceptedWord(word);
                    if (autoSearch) {
                      search(move[1]);
                    }
                  }}
                >
                  <Minus />
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </TableBody>
    </Table>
  );
}
