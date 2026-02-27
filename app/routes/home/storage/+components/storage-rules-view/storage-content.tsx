import RuleButton from "../../../+components/rules-view/rule-view-button";
import { useStorageStore } from "./storage-provider";
export default function StorageContent() {
  const rules = useStorageStore((e) => e.rules);

  const select = useStorageStore((e) => e.select);
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 px-6 pb-6">
      {rules.map((rule) => (
        <RuleButton key={rule.id} rule={rule} />
      ))}
    </div>
  );
}
