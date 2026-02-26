import { ruleSettingsMenuInfo } from "~/constants/rule-settings";
import { useRuleEditorStore } from "../rule-editor-store-provider";

export default function RuleSettingsForm() {
  const menu = useRuleEditorStore((e) => e.menu);
  const { component: Comp } = ruleSettingsMenuInfo[menu];
  return (
    <div className="mx-auto w-full">
      <Comp />
    </div>
  );
}
