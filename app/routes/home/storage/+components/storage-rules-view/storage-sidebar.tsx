import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { RuleEditForm } from "~/routes/engine/$rule/+components/rule-edit/rule-edit-form/rule-edit-form";
import { useStorageStore } from "./storage-provider";

export default function StorageSidebar() {
  const selectedRuleId = useStorageStore((e) => e.selectedRuleId);
  const select = useStorageStore((e) => e.select);
  return (
    <Card className="rounded-lg h-full p-0 bg-background border dark:border-0 sm:max-w-sm w-full relative">
      <Button
        className="absolute top-2 right-2"
        variant="ghost"
        size="icon"
        onClick={() => select(null)}
      >
        <X className="size-4" />
      </Button>
      <RuleEditForm
        ruleId={selectedRuleId!}
        setOpen={(open: boolean) => {
          if (!open) select(null);
        }}
      />
    </Card>
  );
}
