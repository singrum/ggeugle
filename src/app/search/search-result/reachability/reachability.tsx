import {
  CharList,
  CharSection,
  Title,
} from "@/components/char-data-section/char-section";
import type { NodeType } from "@/lib/wordchain/graph/graph";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { useMemo } from "react";

export default function Reachability({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const char = useWcStore((e) => e.searchInputValue);

  const data = useMemo(() => {
    const routeGraph = solver.graphSolver.graphs.getGraph("route");
    const rechables = [...routeGraph.getReachableNodes(view, char)[view]];

    const scc = solver.graphSolver.scc;
    const myComp = scc.map((e) => e[view]).find((e) => e.includes(char));
    const routeChars = routeGraph.nodes(view);
    const unreachable = routeChars.filter((e) => !rechables.includes(e));
    return [
      myComp!.map((e) => ({ char: e, type: "route" as NodeType })),
      rechables
        .filter((e) => !myComp!.includes(e))
        .map((e) => ({ char: e, type: "route" as NodeType })),
      unreachable.map((e) => ({ char: e, type: "route" as NodeType })),
    ];
  }, [view, char, solver]);
  return (
    <div className="space-y-6">
      <CharSection>
        <Title>서로 도달 가능한 음절</Title>
        <CharList charsData={data[0]} />
      </CharSection>
      <CharSection>
        <Title>{char}에서만 도달 가능한 음절 </Title>
        <CharList charsData={data[1]} />
      </CharSection>
      <CharSection>
        <Title>도달 불가능한 음절 </Title>
        <CharList charsData={data[2]} />
      </CharSection>
    </div>
  );
}
