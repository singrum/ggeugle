import { Slash } from "lucide-react";
import { Link } from "react-router";
import IkkiLogo from "../ikki-logo";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 sm:p-6 sm:pb-0">
      <Link to="/home" className=" flex gap-2 items-center shrink-0">
        <IkkiLogo className="h-4 w-auto shrink-0" />
        <Slash className="size-4 -rotate-20 text-muted-foreground" />
        <span className="text-xl font-extrabold rounded-full ">엔진</span>
      </Link>
    </header>
  );
}
