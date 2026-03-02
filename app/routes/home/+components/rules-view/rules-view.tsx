import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useIsTablet } from "~/hooks/use-tablet";
import { RuleEditForm } from "~/routes/engine/$rule/+components/rule-edit/rule-edit-form/rule-edit-form";
import type { RuleMetadata } from "~/types/rule";
import {
  RulesViewStoreProvider,
  useRulesViewStore,
} from "./rules-view-provider";
import RulesViewSidebar from "./rules-view-sidebar";

export default function RulesView({
  rules,
  isSample,
  children,
}: {
  rules: { id: string; order: number; metadata: RuleMetadata }[];
  isSample: boolean;
  children?: React.ReactNode;
}) {
  return (
    <RulesViewStoreProvider rules={rules} isSample={isSample}>
      <RulesViewInner>{children}</RulesViewInner>
    </RulesViewStoreProvider>
  );
}

function RulesViewInner({ children }: { children?: React.ReactNode }) {
  const isTablet = useIsTablet();
  const selectedRuleId = useRulesViewStore((e) => e.selectedRuleId);
  const select = useRulesViewStore((e) => e.select);
  return (
    <div className="p-0 lg:pr-2 lg:py-2 lg:flex-1 flex">
      <Card className="rounded-lg h-full p-0 bg-background lg:border lg:dark:border-0 w-full lg:flex-1 relative">
        <ScrollArea className="lg:h-full">{children}</ScrollArea>
      </Card>
      {selectedRuleId &&
        (!isTablet ? (
          <RulesViewSidebar />
        ) : (
          <Sheet open={!!selectedRuleId} onOpenChange={() => select(null)}>
            <SheetTrigger asChild>
              <button className="hidden" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="hidden" />
              </SheetHeader>
              <RuleEditForm
                ruleId={selectedRuleId!}
                setOpen={(open: boolean) => {
                  if (!open) select(null);
                }}
              />
            </SheetContent>
          </Sheet>
        ))}
    </div>
  );
}
