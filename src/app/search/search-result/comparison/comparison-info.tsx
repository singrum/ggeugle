import { typeMap } from "@/constants/search";
import type { ComparisonData } from "@/types/search";
import { ArrowRight } from "lucide-react";

import { Ball } from "@/components/ball";
import {
  CharList,
  CharSection,
} from "@/components/char-data-section/char-section";
import type { NodeName, NodeType } from "@/lib/wordchain/graph/graph";

export default function ComparisonInfo({
  comparisonData,
}: {
  comparisonData: ComparisonData;
}) {
  return (
    <div className="space-y-6">
      {comparisonData.map(
        ([before, after, nodes]: [NodeType, NodeType, NodeName[]]) =>
          nodes.length > 0 && (
            <CharSection key={`${before}${after}`}>
              <div className="flex items-center gap-2 px-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Ball variant={before} />

                  {typeMap[before]}
                </div>
                <ArrowRight className="stroke-muted-foreground size-3" />
                <div className="flex items-center gap-2 font-medium">
                  <Ball variant={after} />
                  {typeMap[after]}
                </div>
              </div>
              <CharList
                charsData={nodes.map((e) => ({ char: e, type: after }))}
              />
            </CharSection>
          ),
      )}
    </div>
  );
}
