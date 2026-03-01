import { Card, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { sampleChangeFuncInfo } from "~/lib/wordchain/rule/change";
import { ChangeRuleTableMap } from "~/lib/wordchain/rule/change-rule-tables";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../routes/engine/$rule/+components/outline-card";
export default function ChangeRule() {
  const changeRule = useRuleEditorStore(
    (e) => e.localRuleForm.content.wordConnectionRule.changeFuncIdx,
  );
  const storeApi = useRuleEditorStoreApi();

  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>두음 법칙</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent>
        <Select
          value={`${changeRule}`}
          onValueChange={(e: string) => {
            const num = Number(e);
            storeApi.setState((state) => {
              state.localRuleForm.content.wordConnectionRule.changeFuncIdx =
                num;
            });
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sampleChangeFuncInfo.map(({ title }, i) => (
              <SelectItem key={i} value={`${i}`}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {changeRule !== 0 && (
          <Card className="p-6 border mt-2 bg-transparent dark:bg-transparent">
            {ChangeRuleTableMap[changeRule]}
          </Card>
        )}
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
