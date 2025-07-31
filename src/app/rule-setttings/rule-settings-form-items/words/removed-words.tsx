import { CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useWcStore } from "@/stores/wc-store";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";

export default function RemovedWords() {
  const value = useWcStore((e) => e.localRule.wordRule.removedWords);
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>단어 제거</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        <Textarea
          placeholder="제거할 단어들을 입력하세요. (공백으로 구분)"
          value={value}
          onChange={(e) =>
            useWcStore.setState((state) => {
              state.localRule.wordRule.removedWords = e.target.value;
            })
          }
        />
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
