import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import CharInfoTable from "./char-info-table";
import NodeTypeSettings from "./node-type-settings";
import WordDistributionSettings from "./word-distribution-settings";

export default function CharInfo({ solver }: { solver: WordSolver }) {
  // 페이지가 바뀌거나 정렬이 바뀔 때, 페이지 초기화

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center gap-2">
          <NodeTypeSettings />
          <WordDistributionSettings />
        </div>
      </div>

      <CharInfoTable solver={solver} />
    </div>
  );
}
