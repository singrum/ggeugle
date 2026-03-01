import { CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../routes/engine/$rule/+components/outline-card";

export default function NextWordsLimit() {
  const nextWordsLimit = useRuleEditorStore(
    (e) => e.localRuleForm.content.postprocessing.manner.nextWordsLimit,
  );
  const storeApi = useRuleEditorStoreApi();
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>다음 단어 최소 개수</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={nextWordsLimit}
            className="w-25"
            onChange={(e) => {
              storeApi.setState((state) => {
                state.localRuleForm.content.postprocessing.manner.nextWordsLimit =
                  Number(e.target.value);
              });
            }}
          />
          개
        </div>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
