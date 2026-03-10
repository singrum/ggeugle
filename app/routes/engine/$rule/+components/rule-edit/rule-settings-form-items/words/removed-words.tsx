import { CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../outline-card";

export default function RemovedWords() {
  const value = useRuleEditorStore(
    (e) => e.localRuleForm.content.wordRule.removedWords,
  );
  const storeApi = useRuleEditorStoreApi();
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
            storeApi.setState((state) => {
              state.localRuleForm.content.wordRule.removedWords =
                e.target.value;
            })
          }
        />
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
