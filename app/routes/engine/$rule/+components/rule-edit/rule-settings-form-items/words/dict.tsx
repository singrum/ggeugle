import { cloneDeep } from "lodash-es";
import { CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { dicts } from "~/constants/rule";
import {
  useRuleEditorStore,
  useRuleEditorStoreApi,
} from "~/routes/engine/$rule/+components/rule-edit/rule-editor-store-provider";
import {
  OutlineCardContent,
  OutlineCardHeader,
  OutlineCardSection,
} from "../../../outline-card";
export default function Dict() {
  const words = useRuleEditorStore((e) => e.localRuleForm.content.wordRule.words);
  const value = words.type === "manual" ? dicts.length : words.option.dict;
  const storeApi = useRuleEditorStoreApi();
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>사전</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent>
        <Select
          value={`${value}`}
          
          onValueChange={(e: string) => {
            const num = Number(e);
            if (num < dicts.length) { 
              storeApi.setState((state) => {
                state.localRuleForm.content.wordRule.words = {
                  type: "selected",
                  option: {
                    dict: num,
                    pos: cloneDeep(dicts[num].defaultPos),
                    cate: cloneDeep(dicts[num].defaultCate),
                  },
                };
              });
              // selected
            } else {
              // manual
              storeApi.setState((state) => {
                state.localRuleForm.content.wordRule.words = {
                  type: "manual",
                  option: { content: "" },
                };
              });
            }
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dicts.map(({ title }, i) => (
              <SelectItem key={i} value={`${i}`}>
                {title}
              </SelectItem>
            ))}
            <SelectSeparator />
            <SelectItem value={`${dicts.length}`}>직접 입력</SelectItem>
          </SelectContent>
        </Select>
      </OutlineCardContent>
    </OutlineCardSection>
  );
}
