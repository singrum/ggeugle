import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

import { useSearchParams } from "react-router";
import { RuleEditForm } from "./rule-edit-form/rule-edit-form";

export default function RuleEditSheetTrigger({
  ruleId,
  ...props
}: { ruleId: string } & React.ComponentProps<typeof SheetTrigger>) {
  const [searchParams] = useSearchParams();
  const defaultOpen = searchParams.get("edit") || "";

  return (
    <Sheet defaultOpen={!!defaultOpen}>
      <SheetTrigger {...props} />
      <SheetContent className="gap-0">
        <RuleEditForm ruleId={ruleId} />
      </SheetContent>
    </Sheet>
  );
}
