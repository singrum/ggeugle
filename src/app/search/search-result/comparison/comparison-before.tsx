import { getComparisonData } from "@/lib/wordchain/graph/graph-solver";
import { useWcStore } from "@/stores/wc-store";
import type { ComparisonMap } from "@/types/search";
import { useMemo } from "react";
import ComparisonInfo from "./comparison-info";

export default function ComparisonBefore({
  comparisonMap,
}: {
  comparisonMap: ComparisonMap;
}) {
  const view = useWcStore((e) => e.view);
  const data = useMemo(() => {
    return getComparisonData(comparisonMap);
  }, [comparisonMap]);
  return <ComparisonInfo comparisonData={data[view]} />;
}
