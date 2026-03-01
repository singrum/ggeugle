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
} from "../../../../routes/engine/$rule/+components/outline-card";

export default function PostRemovedWords() {
  const value = useRuleEditorStore(
    (e) => e.localRuleForm.content.postprocessing.removedWords,
  );
  const stroreApi = useRuleEditorStoreApi();
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
            stroreApi.setState((state) => {
              state.localRuleForm.content.postprocessing.removedWords =
                e.target.value;
            })
          }
        />
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
