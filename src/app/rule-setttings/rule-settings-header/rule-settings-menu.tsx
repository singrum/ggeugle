import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
} from "@/components/ui/ghost-tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ruleSettingsMenuInfo } from "@/constants/rule-settings";

import { useWcStore } from "@/stores/wc-store";

export default function RuleSettingsMenu() {
  const menu = useWcStore((e) => e.ruleSettingsMenu);
  const setMenu = useWcStore((e) => e.setRuleSettingsMenu);
  return (
    <ScrollArea className="bg-background sticky! top-0 z-10 w-full py-2">
      <GhostTabs
        className="mx-auto w-full max-w-screen-lg px-4 pt-0 whitespace-nowrap md:w-auto md:px-12"
        value={`${menu}`}
      >
        <GhostTabsList>
          {ruleSettingsMenuInfo.map(({ title }, i) => (
            <GhostTabsTrigger
              key={title}
              value={`${i}`}
              onClick={() => {
                setMenu(i);
              }}
            >
              {title}
            </GhostTabsTrigger>
          ))}
        </GhostTabsList>
      </GhostTabs>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
