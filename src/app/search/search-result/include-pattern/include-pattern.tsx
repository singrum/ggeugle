import WordSearchResult from "@/components/word-table/word-search-result";
import { getRegex } from "@/lib/utils";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { useMemo } from "react";
export default function IncludePattern({ solver }: { solver: WordSolver }) {
  const searchInputValue = useWcStore((e) => e.searchInputValue);
  const data = useMemo(() => {
    const movesMap = solver.wordMap.getMoves((word: string) => {
      const regex = getRegex(searchInputValue);
      if (regex === null) {
        return false;
      }
      return regex.test(word);
    });

    const moveClass = solver.graphSolver.classifyMoves(movesMap);
    return solver.moveClassToWordsCards(moveClass);
  }, [solver, searchInputValue]);
  return <WordSearchResult data={data} />;
}
