import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useIsTablet } from "~/hooks/use-tablet";
import RulesViewContent from "./rules-view-content";
import {
  RulesViewStoreProvider,
  useRulesViewStore,
} from "./rules-view-provider";
import RulesViewSidebar from "./rules-view-sidebar";
import RulesViewTitle from "./rules-view-title";

export default function RulesView({
  title,
  rules,
  isSample,
}: {
  title: string;
  rules: { id: string; title: string; color: string }[];
  isSample: boolean;
}) {
  const isTablet = useIsTablet();

  return (
    <RulesViewStoreProvider rules={rules} isSample={isSample}>
      <RulesViewInner title={title} />
    </RulesViewStoreProvider>
  );
}

function RulesViewInner({ title }: { title: string }) {
  const isTablet = useIsTablet();
  const selectedRuleId = useRulesViewStore((e) => e.selectedRuleId);

  return (
    <div className="pr-2 py-2 flex-1 h-full flex gap-2">
      <Card className="rounded-lg h-full p-0 bg-background border dark:border-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-6">
            <RulesViewTitle>{title}</RulesViewTitle>
            <RulesViewContent />
          </div>
        </ScrollArea>
      </Card>
      {!isTablet && selectedRuleId && <RulesViewSidebar />}
    </div>
  );
}
