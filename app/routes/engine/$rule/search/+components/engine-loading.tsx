import { Link } from "react-router";
import { Card } from "~/components/ui/card";
import IkkiLogo from "~/routes/home/+components/ikki-logo";
import MobileNav from "../../+components/mobile-nav";
import { AppSidebar } from "../../+components/nav-sidebar/app-sidebar";

export default function EngineLoading() {
  return (
    <div className="lg:bg-sidebar flex flex-col lg:h-svh min-h-dvh lg:min-h-0">
      <div className="flex-1 min-h-0 flex flex-col lg:relative ">
        <header className="shrink-0 flex items-center justify-between h-14 pl-4 lg:pl-6 pr-2 bg-sidebar border-b lg:border-0">
          <div className="flex items-center gap-4 md:gap-6 min-w-0 ">
            <Link to="/home" className="-m-6 p-6">
              <IkkiLogo className="h-3.5 lg:h-4 w-auto " />
            </Link>
          </div>
        </header>
        <div className="flex-1 flex min-h-auto lg:min-h-0 flex-col lg:flex-row">
          <AppSidebar />
          <div className="lg:pr-2 lg:pb-2 flex-1 h-full flex flex-col">
            <Card className="rounded-none lg:rounded-lg h-full p-0 bg-background lg:border flex-1 flex"></Card>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
