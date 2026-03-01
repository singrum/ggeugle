import { CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../routes/engine/$rule/+components/outline-card";

export default function HeadIndex() {
  const idx = useRuleEditorStore(
    (e) => e.localRuleForm.content.wordConnectionRule.rawHeadIdx,
  );
  const dir = useRuleEditorStore(
    (e) => e.localRuleForm.content.wordConnectionRule.headDir,
  );
  const storeApi = useRuleEditorStoreApi();
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>첫 글자</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-row items-center gap-4">
        <Select
          value={`${dir}`}
          onValueChange={(e: string) => {
            const num = Number(e);
            storeApi.setState((state) => {
              state.localRuleForm.content.wordConnectionRule.headDir = num as 0 | 1;
            });
          }}
        >
          <SelectTrigger className="w-full max-w-45">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[0, 1].map((e) => (
              <SelectItem key={e} value={`${e}`}>
                {e === 0 ? "앞에서부터" : "뒤에서부터"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          className="w-full max-w-25"
          value={idx}
          onChange={(e) =>
            storeApi.setState((state) => {
              state.localRuleForm.content.wordConnectionRule.rawHeadIdx = Number(
                e.target.value,
              );
            })
          }
        />
        <div className="whitespace-nowrap">번째 글자</div>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
