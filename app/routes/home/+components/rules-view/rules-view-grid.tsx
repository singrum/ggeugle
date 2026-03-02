import RuleViewButton from "./rule-view-button";

export function RulesViewGrid({ rules }: { rules: any[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 px-6 pb-6">
      {rules.map((rule) => (
        <RuleViewButton rule={rule} key={rule.id} />
      ))}
    </div>
  );
}
