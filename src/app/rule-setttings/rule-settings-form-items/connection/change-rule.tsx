import { Card, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleChangeFuncInfo } from "@/lib/wordchain/rule/change";
import { ChangeRuleTableMap } from "@/lib/wordchain/rule/change-rule-tables";
import { useWcStore } from "@/stores/wc-store";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../../components/outline-card";
export default function ChangeRule() {
  const changeRule = useWcStore(
    (e) => e.localRule.wordConnectionRule.changeFuncIdx,
  );

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
            useWcStore.setState((state) => {
              state.localRule.wordConnectionRule.changeFuncIdx = num;
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
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
        <Card className="mt-6 p-4 text-sm">
          {ChangeRuleTableMap[changeRule]}
        </Card>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
