import { Slash } from "lucide-react";
import { Link } from "react-router";
import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";
import IkkiLogo from "~/routes/home/+components/ikki-logo";
import MobileSheet from "./mobile-sheet";

export default function Header() {
  return (
    <div className="justify-between p-4 border-b sticky top-0 bg-background z-10 flex items-center h-13 lg:h-14">
      <Link to="/knowledge" className="flex gap-2 items-center shrink-0 p-0">
        <IkkiLogo className="h-3 lg:h-4 w-auto shrink-0" />
        <Slash className="size-3 lg:size-4 -rotate-20 text-muted-foreground" />
        <span className="text-base lg:text-xl font-extrabold rounded-full">
          지식
        </span>
      </Link>

      <div className="gap-2 hidden lg:flex">
        <ModeToggle />
        <Button asChild>
          <Link to="/home">엔진 홈</Link>
        </Button>
      </div>

      <MobileSheet />
    </div>
  );
}
