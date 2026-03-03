import { Slash } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import IkkiLogo from "~/routes/home/+components/ikki-logo";

export default function Header() {
  return (
    <div className="justify-between p-4 border-b sticky top-0 bg-background z-10 flex items-center h-14">
      <Link to="/knowledge" className="flex gap-2 items-center shrink-0 p-2">
        <IkkiLogo className="h-4 w-auto shrink-0" />
        <Slash className="size-4 -rotate-20 text-muted-foreground" />
        <span className="text-xl font-extrabold rounded-full">지식</span>
      </Link>
      <Button variant="secondary" asChild>
        <Link to="/home">엔진 홈</Link>
      </Button>
    </div>
  );
}
