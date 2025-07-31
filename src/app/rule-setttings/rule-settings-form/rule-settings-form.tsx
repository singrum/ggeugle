import { ruleSettingsMenuInfo } from "@/constants/rule-settings";
import { useWcStore } from "@/stores/wc-store";

export default function RuleSettingsForm() {
  const menu = useWcStore((e) => e.ruleSettingsMenu);
  const { component: Comp } = ruleSettingsMenuInfo[menu];
  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-6 pb-36 md:px-12 md:py-6 md:pb-36">
      <Comp />
    </div>
  );
}
