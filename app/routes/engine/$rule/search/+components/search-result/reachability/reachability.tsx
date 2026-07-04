import { useMemo } from "react";
import type { NodeType } from "~/lib/wordchain/graph/graph";
import { sampleChangeFuncs } from "~/lib/wordchain/rule/change";
import type { WordSolver } from "~/lib/wordchain/word/word-solver";
import {
  CharList,
  CharSection,
  Title,
} from "~/routes/engine/$rule/search/+components/char-data-section/char-section";
import { useWcStore } from "~/stores/wc-store-provider";

export default function Reachability({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const char = useWcStore((e) => e.searchInputValue);
  const ruleForm = useWcStore((e) => e.ruleForm);
  const changeFunc =
    sampleChangeFuncs[ruleForm.content.wordConnectionRule.changeFuncIdx];
  const data = useMemo(() => {
    const routeGraph = solver.graphSolver.graphs.getGraph("route");
    const currentSccMap = solver.graphSolver.sccMap[view]; // Map<NodeName, number>

    // 1. 현재 검색어(char)가 속한 SCC ID 찾기
    const targetSccId = currentSccMap.get(char);

    // 2. 같은 SCC 컴포넌트에 속한 음절들 추출
    const myComp: string[] = [];
    if (targetSccId !== undefined) {
      for (const [node, sccId] of currentSccMap.entries()) {
        if (sccId === targetSccId) {
          myComp.push(node);
        }
      }
    }

    // O(1) 조회를 위해 Set 구조로 변환
    const myCompSet = new Set(myComp);

    // 3. 도달 가능한 노드 조회 및 성능 최적화를 위한 Set 변환
    const reachablesArray = [
      ...routeGraph.getReachableNodes(view, char, changeFunc)[view],
    ];
    const reachablesSet = new Set(reachablesArray);

    const routeChars = routeGraph.nodes(view);

    // 4. 세 가지 세션 데이터 필터링 연산
    // 💡 [수정] 배열을 모은 직후 순수 .sort()로 정렬하고 .map()을 돌립니다.

    // data[0]: 서로 도달 가능한 음절
    myComp.sort();
    const sameCompData = myComp.map((e) => ({
      char: e,
      type: "route" as NodeType,
    }));

    // data[1]: char에서만 도달 가능한 음절
    const reachableOnlyRaw: string[] = [];
    for (let i = 0; i < reachablesArray.length; i++) {
      const e = reachablesArray[i];
      if (!myCompSet.has(e)) {
        reachableOnlyRaw.push(e);
      }
    }
    reachableOnlyRaw.sort(); // 순수 문자열 배열 정렬
    const reachableOnlyData = reachableOnlyRaw.map((e) => ({
      char: e,
      type: "route" as NodeType,
    }));

    // data[2]: 도달 불가능한 음절
    const unreachableRaw: string[] = [];
    for (let i = 0; i < routeChars.length; i++) {
      const e = routeChars[i];
      if (!reachablesSet.has(e)) {
        unreachableRaw.push(e);
      }
    }
    unreachableRaw.sort(); // 순수 문자열 배열 정렬
    const unreachableData = unreachableRaw.map((e) => ({
      char: e,
      type: "route" as NodeType,
    }));

    return [sameCompData, reachableOnlyData, unreachableData];
  }, [view, char, solver, changeFunc]);

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
