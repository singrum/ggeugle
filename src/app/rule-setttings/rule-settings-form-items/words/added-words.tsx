import { CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useWcStore } from "@/stores/wc-store";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";

export default function AddedWords() {
  const value = useWcStore((e) => e.localRule.wordRule.addedWords);
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>단어 추가</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        <Textarea
          placeholder="추가할 단어들을 입력하세요. (공백으로 구분)"
          value={value}
          onChange={(e) =>
            useWcStore.setState((state) => {
              state.localRule.wordRule.addedWords = e.target.value;
            })
          }
        />
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
