import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import WordStack from "@/components/word-stack/word-stack";
import { cn } from "@/lib/utils";
import type { NodeName } from "@/lib/wordchain/graph/graph";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
import { Fragment, useMemo } from "react";

export default function MoveSection({
  solver,
  move,
}: {
  solver: WordSolver;
  move: [NodeName, NodeName];
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        <ActionButton move={move} />
        <Words move={move} solver={solver} />
      </div>
      <div className="space-y-2">
        <SearchStatus move={move} />
        <SearchStack move={move} solver={solver} />
      </div>
    </div>
  );
}

function ActionButton({ move }: { move: [NodeName, NodeName] }) {
  const startSingleThreadSearch = useWcStore((e) => e.startSingleThreadSearch);
  const resetSingleThreadSearch = useWcStore((e) => e.resetSingleThreadSearch);
  const status = useWcStore(
    (e) => e.singleThreadSearchInfo.mapping[move[0]][move[1]].status,
  );

  const isWin = useWcStore(
    (e) => e.singleThreadSearchInfo.mapping[move[0]][move[1]].isWin,
  );
  const isDone = status === "done";

  return (
    <Button
      variant={"secondary"}
      size="icon"
      className={cn("rounded-full", {
        "bg-win/10 hover:bg-win/10 cursor-default": isDone && isWin,
        "bg-lose/10 hover:bg-lose/10 cursor-default": isDone && !isWin,
      })}
      onClick={() => {
        if (isDone) {
          return;
        }
        if (status !== "searching") {
          startSingleThreadSearch([move[0], move[1]]);
        } else {
          resetSingleThreadSearch([move[0], move[1]]);
        }
      }}
    >
      {isDone ? (
        isWin ? (
          <div className="text-win">승</div>
        ) : (
          <div className="text-lose">패</div>
        )
      ) : status === "searching" ? (
        <Square fill="var(--color-foreground)" className="stroke-foreground" />
      ) : (
        <Play fill="var(--color-foreground)" className="stroke-foreground" />
      )}
    </Button>
  );
}

function Words({
  move,
  solver,
}: {
  move: [NodeName, NodeName];
  solver: WordSolver;
}) {
  const words = useMemo(() => {
    if (move[0] === "__none") {
      return [`${move[1]}`];
    } else {
      return (solver.wordMap.get(move[0], move[1]) || []).slice(
        ...solver.graphSolver.graphs.getEdgeIdxRange(move[0], move[1], "route"),
      );
    }
  }, [move, solver]);

  const search = useWcStore((e) => e.search);
  const addExceptedWord = useWcStore((e) => e.addExceptedWord);

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        className="px-3"
        onClick={() => {
          addExceptedWord(words[0]);
          search(words[0].at(solver.tailIdx)!);
        }}
      >
        {words[0]}
      </Button>
      {words.length > 1 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="text-muted-foreground px-2"
            >
              +{words.length - 1}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-wrap gap-1">
              {words.map((word, i) => (
                <Fragment key={word}>
                  <div>
                    {word}
                    {words.length - 1 !== i ? "," : ""}
                  </div>
                </Fragment>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

function SearchStatus({ move }: { move: [NodeName, NodeName] }) {
  const status = useWcStore(
    (e) => e.singleThreadSearchInfo.mapping[move[0]][move[1]].status,
  );

  const duration: number = useWcStore(
    (e) => e.singleThreadSearchInfo.mapping[move[0]][move[1]].duration,
  ) as number;

  return status === "searching" ? (
    <div className="text-muted-foreground animate-pulse text-xs">탐색 중..</div>
  ) : status === "done" ? (
    <div className="text-muted-foreground text-xs">탐색 완료({duration}초)</div>
  ) : undefined;
}

function SearchStack({
  move,
  solver,
}: {
  move: [NodeName, NodeName];
  solver: WordSolver;
}) {
  const status = useWcStore(
    (e) => e.singleThreadSearchInfo.mapping[move[0]][move[1]].status,
  );

  const stack = useWcStore(
    (e) => e.singleThreadSearchInfo.mapping[move[0]][move[1]].stack,
  );
  const words = solver.getDistinctRouteWords(stack);

  return (
    <motion.div
      animate={{
        height:
          status === "done" ? "auto" : status === "searching" ? "6rem" : "0rem",
      }}
      initial={false}
      transition={{ duration: 0.3 }}
      className="overflow-auto"
      // className={cn("h-0 overflow-auto", {
      //   "h-24": status === "searching",
      //   "h-fit": status === "done",
      // })}
    >
      <WordStack words={words} clickable={status === "done"} />
    </motion.div>
  );
}
