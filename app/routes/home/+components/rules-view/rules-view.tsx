import { X } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useIsTablet } from "~/hooks/use-tablet";
import { RuleEditForm } from "~/routes/engine/$rule/+components/rule-edit/rule-edit-form/rule-edit-form";
import RulesViewContent from "./rules-view-content";
import RulesViewTitle from "./rules-view-title";

export default function RulesView({
  title,
  rules,
}: {
  title: string;
  rules: { id: string; title: string; color: string; updatedAt: number }[];
}) {
  const [selectedRuleId, setSelectedRuleId] = React.useState<string | null>(
    null,
  );
  const isTablet = useIsTablet();

  return (
    <div className="pr-2 py-2 flex-1 h-full flex gap-2">
      <Card className="rounded-lg h-full p-0 bg-background border dark:border-0 flex-1">
        <ScrollArea className="h-full">
          <div className="p-6">
            <RulesViewTitle>{title}</RulesViewTitle>
            <RulesViewContent
              rules={rules}
              selectedRuleId={selectedRuleId}
              setSelectedRuleId={setSelectedRuleId}
            />
          </div>
        </ScrollArea>
      </Card>
      {!isTablet && selectedRuleId && (
        <Card className="rounded-lg h-full p-0 bg-background border dark:border-0 sm:max-w-sm w-full relative">
          <Button
            className="absolute top-2 right-2"
            variant="ghost"
            size="icon"
            onClick={() => setSelectedRuleId(null)}
          >
            <X className="size-4" />
          </Button>
          <RuleEditForm ruleId={selectedRuleId} />
        </Card>
      )}
    </div>
  );
}
