import RulesEmpty from "./rules-empty";
import { RulesViewGrid } from "./rules-view-grid";
import { useRulesViewStore } from "./rules-view-provider";
import { RulesViewSortable } from "./rules-view-sortable";

export default function RulesViewContent() {
  const rules = useRulesViewStore((e) => e.rules);
  const reorder = useRulesViewStore((e) => e.reorder);
  const isSample = useRulesViewStore((e) => e.isSample);

  return (
    <div className="space-y-1 p-0 pt-6">
      {isSample ? (
        <RulesViewGrid rules={rules} />
      ) : rules.length > 0? (
        <RulesViewSortable rules={rules} reorder={reorder} />
      ) : <RulesEmpty />}
    </div>
  );
}
