import { useMemo } from "react";
import { getComparisonData } from "~/lib/wordchain/graph/graph-solver";
import { sampleChangeFuncs } from "~/lib/wordchain/rule/change";
import type { WordSolver } from "~/lib/wordchain/word/word-solver";
import { useWcStore } from "~/stores/wc-store-provider";
import ComparisonInfo from "./comparison-info";

export default function ComparisonOrigin({ solver }: { solver: WordSolver }) {
  const originalSolver = useWcStore((e) => e.originalSolver);
  const view = useWcStore((e) => e.view);
  const ruleForm = useWcStore((e) => e.ruleForm);
  const data = useMemo(() => {
    const mapping = originalSolver!.graphSolver.getComparisonMap(
      solver.graphSolver,
      sampleChangeFuncs[ruleForm.wordConnectionRule.changeFuncIdx],
    );
    const result = getComparisonData(mapping);
    return result;
  }, [solver, originalSolver, ruleForm]);
  return <ComparisonInfo comparisonData={data[view]} />;
}
