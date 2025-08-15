import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
} from "@/components/ui/ghost-tabs";
import { strategySearchMethods } from "@/constants/search";
import { useWcStore } from "@/stores/wc-store";
export default function SearchMethodSelect() {
  const method = useWcStore((e) => e.strategySearchMethod);
  const setMethod = useWcStore((e) => e.setStrategySearchMethod);
  console.log(strategySearchMethods);
  return (
    <GhostTabs
      value={String(method)}
      className="w-full gap-8"
      onValueChange={(e) => setMethod(Number(e))}
    >
      <GhostTabsList className="mx-0">
        {strategySearchMethods.map(({ title }, i) => (
          <GhostTabsTrigger key={i} value={String(i)}>
            {title}
          </GhostTabsTrigger>
        ))}
      </GhostTabsList>
    </GhostTabs>
  );
}
