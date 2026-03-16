import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

import { useState } from "react";
import { RuleEditForm } from "./rule-edit-form/rule-edit-form";

export default function RuleEditSheetTrigger({
  ruleId,
  ...props
}: { ruleId: string } & React.ComponentProps<typeof SheetTrigger>) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger {...props} />
      <SheetContent
        className="gap-0"
        onPointerDownOutside={(e) => {
          // 클릭된 요소가 SelectContent 내부에 있는지 확인
          const target = e.target as HTMLElement;
          if (target?.closest("[data-radix-select-content]")) {
            e.preventDefault();
          }
        }}
      >
        <RuleEditForm ruleId={ruleId} />
      </SheetContent>
    </Sheet>
  );
}
