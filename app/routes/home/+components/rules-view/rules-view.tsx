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
    <div className="p-0 md:pr-2 md:py-2 md:flex-1 md:h-full flex gap-2">
      <Card className="rounded-lg h-full p-0 bg-background sm:border sm:dark:border-0 w-full md:flex-1">
        <ScrollArea className="md:h-full">
          <div className="space-y-1 p-0 min-h-svh">
            <div className="p-6 sticky top-0 z-20 bg-background md:rounded-t-lg">
              <RulesViewTitle>{title}</RulesViewTitle>
            </div>
            <RulesViewContent />
          </div>
        </ScrollArea>
      </Card>
      {!isTablet && selectedRuleId && <RulesViewSidebar />}
    </div>
  );
}
