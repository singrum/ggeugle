import { sampleChangeFuncs } from "@/lib/wordchain/rule/change";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { josa } from "es-hangul";
import { useMemo } from "react";
import {
  CharList,
  CharSection,
  Title,
} from "../../../../components/char-data-section/char-section";

export default function ChangeableChars({ solver }: { solver: WordSolver }) {
  const changeFuncIdx = useWcStore(
    (e) => e.rule.wordConnectionRule.changeFuncIdx,
  );
  const char = useWcStore((e) => e.searchInputValue);
  const data = useMemo(() => {
    return solver.graphSolver.getChangeablesCharsData(
      char,
      sampleChangeFuncs[changeFuncIdx],
    );
  }, [solver, char, changeFuncIdx]);

  return (
    <div className="space-y-6">
      <CharSection>
        <Title>{char}에서 바꿀 수 있는 음절</Title>
        <CharList
          charsData={data.to.map((e) => ({ char: e[0], type: e[1] }))}
        />
      </CharSection>
      <CharSection>
        <Title>{josa(char, "으로/로")} 바꿀 수 있는 음절</Title>
        <CharList
          charsData={data.from.map((e) => ({ char: e[0], type: e[1] }))}
        />
      </CharSection>
    </div>
  );
}
