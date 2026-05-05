import { Link } from "react-router";
import { useIsTablet } from "~/hooks/use-tablet";

import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { LoaderData } from "~/types/rule";
import PreferenceSettingsTrigger from "./preference-settings";
import { RuleButton } from "./rule-button";
import SearchPrecedenceSettingsTrigger from "./search-precedence-settings";
import { MiniToolbar, Toolbar } from "./toolbar";

export default function SiteHeader({ loaderData }: { loaderData: LoaderData }) {
  const isTablet = useIsTablet();

  return (
    <header className="shrink-0 flex items-center justify-between h-14 pl-4 lg:pl-6 pr-2 bg-sidebar border-b lg:border-0">
      <div className="flex items-center gap-4 lg:gap-6 min-w-0">
        <Button asChild variant="ghost" size="icon-lg">
          <Link to="/home" className="-mx-3 lg:-mx-4">
            <ChevronLeft className="size-5 " />
          </Link>
        </Button>
        <RuleButton loaderData={loaderData} />
      </div>
      <div className="flex items-center">
        {!isTablet ? <Toolbar /> : <MiniToolbar />}
        <PreferenceSettingsTrigger asChild>
          <button className="hidden" id="preference-settings-trigger" />
        </PreferenceSettingsTrigger>
        <SearchPrecedenceSettingsTrigger asChild>
          <button className="hidden" id="search-precedence-settings-trigger" />
        </SearchPrecedenceSettingsTrigger>
      </div>
    </header>
  );
}
