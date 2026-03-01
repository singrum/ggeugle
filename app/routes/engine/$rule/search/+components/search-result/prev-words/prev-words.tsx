import { useMemo } from "react";

import { sampleChangeFuncs } from "~/lib/wordchain/rule/change";
import type { WordSolver } from "~/lib/wordchain/word/word-solver";
import { useWcStore } from "~/stores/wc-store-provider";
import WordSearchResult from "../../word-table/word-search-result";
export default function PrevWords({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const searchInputValue = useWcStore((e) => e.searchInputValue);
  const rule = useWcStore((e) => e.ruleForm);

  const data = useMemo(
    () =>
      solver.getWordsCardsFromChar(
        searchInputValue,
        view,
        1,
        sampleChangeFuncs[rule.content.wordConnectionRule.changeFuncIdx],
      ),
    [solver, view, searchInputValue, rule],
  );

  return <WordSearchResult data={data} />;
}
