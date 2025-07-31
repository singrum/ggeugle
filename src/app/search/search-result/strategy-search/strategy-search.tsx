import { strategySearchMethods } from "@/constants/search";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";

export default function StrategySearch({ solver }: { solver: WordSolver }) {
  const Comp = strategySearchMethods[0].component;
  return (
    <div className="space-y-12">
      <Comp solver={solver} />
    </div>
  );
}
