import { useIsMobile } from "~/hooks/use-mobile";

import { Link } from "react-router";
import { useIsTablet } from "~/hooks/use-tablet";
import IkkiLogo from "~/routes/home/+components/ikki-logo";
import { RuleButton } from "./rule-button";
import { MiniToolbar, Toolbar } from "./toolbar";

export default function SiteHeader({ ruleTitle }: { ruleTitle?: string }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <header className="flex items-center justify-between h-(--header-height) pl-6 pr-2">
      <div className="flex items-center gap-4">
        <Link to="/home" className="-m-6 p-6">
          <IkkiLogo className="h-4 w-auto text-muted-foreground" />
        </Link>
        <RuleButton ruleTitle={ruleTitle} />
      </div>
      {!isMobile ? <Toolbar /> : <MiniToolbar />}
    </header>
  );
}
