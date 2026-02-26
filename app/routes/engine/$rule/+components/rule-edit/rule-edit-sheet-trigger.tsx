import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

import { RuleEditForm } from "./rule-edit-form/rule-edit-form";

export default function RuleEditSheetTrigger({
  ruleId,
  ...props
}: { ruleId: string } & React.ComponentProps<typeof SheetTrigger>) {
  return (
    <Sheet>
      <SheetTrigger {...props} />
      <SheetContent className="gap-0">
        <RuleEditForm ruleId={ruleId} />
      </SheetContent>
    </Sheet>
  );
}
