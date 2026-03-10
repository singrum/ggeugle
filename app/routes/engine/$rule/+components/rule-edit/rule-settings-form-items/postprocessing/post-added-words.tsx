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

export default function AddedWords() {
  const value = useRuleEditorStore(
    (e) => e.localRuleForm.content.postprocessing.addedWords,
  );
  const storeApi = useRuleEditorStoreApi();
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>단어 추가</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        <Textarea
          value={value}
          placeholder="추가할 단어들을 입력하세요. (공백으로 구분)"
          onChange={(e) =>
            storeApi.setState((state) => {
              state.localRuleForm.content.postprocessing.addedWords =
                e.target.value;
            })
          }
        />
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
