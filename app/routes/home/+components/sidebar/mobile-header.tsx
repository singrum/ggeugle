import { Plus, Slash } from "lucide-react";
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
export default function MobileHeader() {
  return (
    <header className="bg-sidebar border-b flex justify-between items-center pr-2">
      <div className="p-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex gap-2 items-center w-fit h-auto py-2 px-3 -my-2 -mx-3 bg-transparent">
                <IkkiLogo className="h-3.5 w-auto shrink-0" />
                <Slash className="size-3.5 -rotate-20 text-muted-foreground" />
                <span className="text-base font-extrabold rounded-full">
                  엔진
                </span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-32">
                  <NavigationMenuLink href="https://ikki.app">
                    이끼
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/">
                    끝말잇기 엔진
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* <Link to="/home" className="flex gap-2 items-center w-fit ">
          <IkkiLogo className="h-3.5 w-auto shrink-0" />
          <Slash className="size-3.5 -rotate-20 text-muted-foreground" />
          <span className="text-base font-extrabold rounded-full">엔진</span>
        </Link> */}
      </div>
      <AddRuleButton asChild>
        <Button variant="ghost" size="icon-lg">
          <Plus className="stroke-foreground size-5" />
        </Button>
      </AddRuleButton>
    </header>
  );
}
