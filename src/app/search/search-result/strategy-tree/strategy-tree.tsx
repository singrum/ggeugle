import { WcStrategyTree } from "@/lib/wordchain/graph/strategy-tree";
import { sampleChangeFuncs } from "@/lib/wordchain/rule/change";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useTreeStore } from "@/stores/tree-store";
import { useWcStore } from "@/stores/wc-store";
import { useEffect } from "react";
import LosingMoves from "./losing-moves";
import WinningMoves from "./winning-moves";

export default function StrategyTree({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const rule = useWcStore((e) => e.rule);
  const searchInputValue = useWcStore((e) => e.searchInputValue);
  const setTree = useTreeStore((e) => e.setTree);
  const treeData = useTreeStore((e) => e.treeData);
  useEffect(() => {
    setTree(
      new WcStrategyTree(
        solver,
        view,
        searchInputValue,
        sampleChangeFuncs[rule.wordConnectionRule.changeFuncIdx],
      ),
    );
  }, [solver, searchInputValue, view, rule, setTree]);

  if (treeData) {
    return (
      <div className="ml-2 space-y-4 border-l-2 pl-4 md:pl-6">
        {treeData!.map((e) =>
          e.isWin === true ? (
            <WinningMoves data={e.word} key={e.depth} />
          ) : (
            <LosingMoves data={e} key={`lose${e.depth}`} />
          ),
        )}
      </div>
    );
  }
}
