import { CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useWcStore } from "@/stores/wc-store";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";

export default function PostRemovedWords() {
  const value = useWcStore((e) => e.localRule.postprocessing.removedWords);
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>단어 제거</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        <Textarea
          value={value}
          placeholder="제거할 단어들을 입력하세요. (공백으로 구분)"
          onChange={(e) =>
            useWcStore.setState((state) => {
              state.localRule.postprocessing.removedWords = e.target.value;
            })
          }
        />
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
