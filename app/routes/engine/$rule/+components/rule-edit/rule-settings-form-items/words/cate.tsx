import { CardTitle } from "~/components/ui/card";
import { Toggle } from "~/components/ui/toggle";
import { cates, dicts } from "~/constants/rule";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";
import type { SelectedWordsOption } from "~/types/rule";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../outline-card";

export default function Cate() {
  const cate = useRuleEditorStore(
    (e) =>
      (e.localRuleForm.content.wordRule.words.option as SelectedWordsOption)
        .cate,
  );
  const dict = useRuleEditorStore(
    (e) =>
      (e.localRuleForm.content.wordRule.words.option as SelectedWordsOption)
        .dict,
  );
  const storeApi = useRuleEditorStoreApi();

  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>범주</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        {cates.map((e) => (
          <Toggle
            variant="outline"
            key={e}
            pressed={cate[e] === 1}
            disabled={!dicts[dict].activeCate[e]}
            onPressedChange={(value: boolean) => {
              storeApi.setState((state) => {
                (
                  state.localRuleForm.content.wordRule.words
                    .option as SelectedWordsOption
                ).cate[e] = Number(value) as 0 | 1;
              });
            }}
          >
            {e}
          </Toggle>
        ))}
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
