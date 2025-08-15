import { strategySearchMethods } from "@/constants/search";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import SearchMethodSelect from "./search-method-select";

export default function StrategySearch({ solver }: { solver: WordSolver }) {
  const method = useWcStore((e) => e.strategySearchMethod);
  const Comp = strategySearchMethods[method].component;
  return (
    <div className="space-y-12">
      <SearchMethodSelect />
      <Comp solver={solver} />
    </div>
  );
}
