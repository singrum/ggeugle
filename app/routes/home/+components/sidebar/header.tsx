import { PlusCircleIcon } from "@phosphor-icons/react";
import { Slash } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import AddRuleButton from "../add-rule-button";
import IkkiLogo from "../ikki-logo";

export default function Header() {
  return (
    <header className="space-y-4 justify-between p-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className=" flex gap-2 items-center shrink-0 p-2 bg-transparent h-auto">
              <IkkiLogo className="h-4 w-auto shrink-0" />
              <Slash className="size-4 -rotate-20 text-muted-foreground" />
              <span className="text-xl font-extrabold rounded-full">엔진</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-32">
                <NavigationMenuLink href="https://ikki.app">
                  이끼
                </NavigationMenuLink>
                <NavigationMenuLink href="/">끝말잇기 엔진</NavigationMenuLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

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
