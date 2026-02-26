import { ruleSettingsMenuInfo } from "~/constants/rule-settings";
import { useRuleEditorStore } from "../rule-editor-store-provider";

export default function RuleEditContent() {
  const menu = useRuleEditorStore((e) => e.menu);
  const { component: Comp } = ruleSettingsMenuInfo[menu];
  return <Comp />;
}
