import { Plus, Slash } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import AddRuleButton from "../add-rule-button";
import IkkiLogo from "../ikki-logo";

export default function MobileHeader() {
  return (
    <header className="bg-sidebar border-b dark:border-0 flex justify-between items-center pr-4">
      <div className="p-4">
        <Link to="/home" className="flex gap-2 items-center w-fit ">
          <IkkiLogo className="h-3 w-auto shrink-0" />
          <Slash className="size-3 -rotate-20 text-muted-foreground" />
          <span className="text-base font-extrabold rounded-full">엔진</span>
        </Link>
      </div>
      <AddRuleButton asChild>
        <Button variant="ghost" size="icon-lg">
          <Plus className="stroke-foreground size-5" />
        </Button>
      </AddRuleButton>
    </header>
  );
}
