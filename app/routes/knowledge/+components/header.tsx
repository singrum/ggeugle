import { Slash } from "lucide-react";
import { Link } from "react-router";
import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";
import IkkiLogo from "~/routes/home/+components/ikki-logo";
import MobileSheet from "./mobile-sheet";

export default function Header() {
  return (
    <div className="justify-between p-4 pr-2 lg:px-6 border-b sticky top-0 bg-background z-10 flex items-center h-13 lg:h-14">
      <div className="flex items-center shrink-0 p-0 -mx-2">
        <a href="https://ikki.app" target="_blank" className="p-2">
          <IkkiLogo className="h-3.5 lg:h-4 w-auto shrink-0" />
        </a>
        <Slash className="size-3.5 lg:size-4 -rotate-20 text-muted-foreground" />
        <Link
          to="/knowledge"
          className="text-base lg:text-xl font-extrabold rounded-full p-2"
        >
          지식
        </Link>
      </div>

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
