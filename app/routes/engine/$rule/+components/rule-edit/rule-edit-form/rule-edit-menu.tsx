import {
  LineTabs,
  LineTabsList,
  LineTabsTrigger,
} from "~/components/ui/line-tabs";
import { ruleSettingsMenuInfo } from "~/constants/rule-settings";
import { useRuleEditorStore } from "../rule-editor-store-provider";
export function RuleEditMenu() {
  const menu = useRuleEditorStore((e) => e.menu);
  const setMenu = useRuleEditorStore((e) => e.setMenu);

  return (
    <LineTabs className="w-full pt-0 whitespace-nowrap px-4" value={`${menu}`}>
      <LineTabsList className="px-0 gap-2">
        {ruleSettingsMenuInfo.map(({ title }, i) => (
          <LineTabsTrigger
            className="text-sm px-2"
            key={title}
            value={`${i}`}
            onClick={() => {
              setMenu(i);
            }}
          >
            {title}
          </LineTabsTrigger>
        ))}
      </LineTabsList>
    </LineTabs>
  );
}
