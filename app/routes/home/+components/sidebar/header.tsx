import { PlusCircleIcon } from "@phosphor-icons/react";
import { Slash } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import AddRuleButton from "../add-rule-button";
import IkkiLogo from "../ikki-logo";

export default function Header() {
  return (
    <header className="space-y-4 justify-between p-4">
      <div className=" flex items-center shrink-0 p-0">
        <a href="https://ikki.app" target="_blank" className="p-2">
          <IkkiLogo className="h-4 w-auto shrink-0" />
        </a>

        <Slash className="size-4 -rotate-20 text-muted-foreground" />
        <Link to="/home">
          <span className="text-xl font-extrabold rounded-full p-2">엔진</span>
        </Link>
      </div>
      <AddRuleButton asChild>
        <Button className="w-full justify-start">
          <PlusCircleIcon
            weight="fill"
            className="stroke-primary-foreground size-5 mr-2"
          />
          룰 추가
        </Button>
      </AddRuleButton>
    </header>
  );
}
