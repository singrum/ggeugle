import { Link } from "react-router";
import IkkiLogo from "../ikki-logo";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-(--header-height) px-6">
      <Link to="/home" className="-m-6 p-6">
        <IkkiLogo className="h-4 w-auto text-muted-foreground" />
      </Link>
    </header>
  );
}
