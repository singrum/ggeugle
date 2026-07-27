import { useEffect } from "react";
import { useLocation } from "react-router";
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

export default function RulesView({
  rules,
  isSample,
  children,
}: {
  rules: { id: string; order: number; metadata: RuleMetadata }[];
  isSample: boolean;
  children?: React.ReactNode;
}) {
  const { pathname } = useLocation();
  useEffect(() => {
    localStorage.setItem("last_home_path", pathname);
  }, [pathname]);
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
    <div className="p-0 lg:pr-2 lg:py-2 lg:flex-1 flex flex-1 lg:min-h-0">
      <Card className="rounded-lg h-full p-0 bg-background lg:border w-full lg:flex-1 relative ">
        <ScrollArea className="hidden lg:block lg:h-full">
          {children}
        </ScrollArea>
        <div className="lg:hidden">{children}</div>
      </Card>
      {selectedRuleId && (
        <Sheet open={!!selectedRuleId} onOpenChange={() => select(null)}>
          <SheetTrigger asChild>
            <button className="hidden" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="hidden">
              <SheetTitle className="hidden" />
            </SheetHeader>
            <RuleEditForm ruleId={selectedRuleId!} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
