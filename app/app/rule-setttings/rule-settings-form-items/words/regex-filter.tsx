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
import RegexExamples from "./regex-examples";

export default function RegexFilter() {
  const value = useRuleEditorStore((e) => e.localRuleForm.wordRule.regexFilter);
  const storeApi = useRuleEditorStoreApi();
  return (
    <OutlineCardSection>
      <OutlineCardHeader>
        <CardTitle>Regex 필터</CardTitle>
      </OutlineCardHeader>
      <OutlineCardContent className="flex flex-wrap gap-2">
        <Input
          value={value}
          onChange={(e) =>
            storeApi.setState((state) => {
              state.localRuleForm.wordRule.regexFilter = e.target.value;
            })
          }
        />
      </OutlineCardContent>
      <RegexExamples />
    </OutlineCardSection>
  );
}
