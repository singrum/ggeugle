import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";

import type { SingleMove } from "@/lib/wordchain/graph/graph";
import type { CriticalWordInfo } from "@/types/search";
import { useEffect } from "react";
import CriticalWordsTable from "./critical-words-table";
export default function CriticalWords({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const initCriticalWords = useWcStore((e) => e.initCriticalWords);
  const clearCriticalWords = useWcStore((e) => e.clearCriticalWords);
  const criticalEdgeMap = useWcStore((e) => e.criticalEdgeMap);
  useEffect(() => {
    initCriticalWords();
    return clearCriticalWords;
  }, [view, solver, initCriticalWords, clearCriticalWords]);
  const data: { move: SingleMove; info: CriticalWordInfo }[] = Object.entries(
    criticalEdgeMap || {},
  )
    .map(([head, e]) =>
      Object.entries(e).map(([tail, info]) => ({
        move: [head, tail] as SingleMove,
        info,
      })),
    )
    .flat()
    .sort((a, b) => {
      const num1 = a.info.difference
        ? a.info.difference.win.length +
          a.info.difference.lose.length +
          a.info.difference.loopwin.length
        : -1;
      const num2 = b.info.difference
        ? b.info.difference.win.length +
          b.info.difference.lose.length +
          b.info.difference.loopwin.length
        : -1;
      return -num1 + num2;
    });

  return <CriticalWordsTable data={data} />;
}
