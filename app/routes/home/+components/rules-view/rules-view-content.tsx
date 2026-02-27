import RuleViewButton from "./rule-view-button";
import { useRulesViewStore } from "./rules-view-provider";
export default function RulesViewContent() {
  const rules = useRulesViewStore((e) => e.rules);
  const isSample = useRulesViewStore((e) => e.isSample);

  const select = useRulesViewStore((e) => e.select);
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 px-6 pb-6">
      {rules.map((rule) => (
        <RuleViewButton key={rule.id} rule={rule} />
      ))}
    </div>
  );
}
