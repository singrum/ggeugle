import { Plus, Slash } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import AddRuleButton from "../add-rule-button";
import IkkiLogo from "../ikki-logo";

export default function MobileHeader() {
  return (
    <header className="bg-sidebar border-b flex justify-between items-center pr-2 h-14">
      <div className="p-4">
        <div className="flex items-center w-fit ">
          <a href="https://ikki.app" target="_blank" className="p-2">
            <IkkiLogo className="h-3.5 w-auto shrink-0" />
          </a>
          <Slash className="size-3.5 -rotate-20 text-muted-foreground" />
          <Link to="/home">
            <span className="text-base font-extrabold rounded-full p-2">
              엔진
            </span>
          </Link>
        </div>
      </div>
      <AddRuleButton asChild>
        <Button variant="ghost" size="icon-lg">
          <Plus className="stroke-foreground size-5" />
        </Button>
      </AddRuleButton>
    </header>
  );
}
