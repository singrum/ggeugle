import {
  GhostTabs,
  GhostTabsContent,
  GhostTabsList,
  GhostTabsTrigger,
} from "@/components/ui/ghost-tabs";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import ComparisonBefore from "./comparison-before";
import ComparisonOrigin from "./comparison-origin";
export default function Comparison({ solver }: { solver: WordSolver }) {
  const data = useWcStore((e) => e.comparisonMap);

  return data ? (
    <GhostTabs defaultValue="before" className="w-full gap-6">
      <GhostTabsList className="mx-0">
        <GhostTabsTrigger value="before">이전과 비교</GhostTabsTrigger>
        <GhostTabsTrigger value="origin">원본과 비교</GhostTabsTrigger>
      </GhostTabsList>
      <GhostTabsContent value="before">
        <ComparisonBefore comparisonMap={data} />
      </GhostTabsContent>
      <GhostTabsContent value="origin">
        <ComparisonOrigin solver={solver} />
      </GhostTabsContent>
    </GhostTabs>
  ) : (
    <div>
      ⚠️ 단어가 추가되거나 제거된 변경 사항이 없어서 비교를 진행할 수 없습니다.
    </div>
  );
}
