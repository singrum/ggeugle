import WordSearchResult from "@/components/word-table/word-search-result";
import { sampleChangeFuncs } from "@/lib/wordchain/rule/change";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { useMemo } from "react";
export default function PrevWords({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const searchInputValue = useWcStore((e) => e.searchInputValue);
  const rule = useWcStore((e) => e.rule);

  const data = useMemo(
    () =>
      solver.getWordsCardsFromChar(
        searchInputValue,
        view,
        1,
        sampleChangeFuncs[rule.wordConnectionRule.changeFuncIdx],
      ),
    [solver, view, searchInputValue, rule],
  );

  return <WordSearchResult data={data} />;
}
