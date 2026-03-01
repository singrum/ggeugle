import { Link } from "react-router";
import { useIsTablet } from "~/hooks/use-tablet";
import IkkiLogo from "~/routes/home/+components/ikki-logo";
import type { LoaderData } from "../../_layout";
import PreferenceSettingsTrigger from "./preference-settings";
import { RuleButton } from "./rule-button";
import SearchPrecedenceSettingsTrigger from "./search-precedence-settings";
import { MiniToolbar, Toolbar } from "./toolbar";

export default function SiteHeader({ loaderData }: { loaderData: LoaderData }) {
  const isTablet = useIsTablet();

  return (
    <header className="shrink-0 flex items-center justify-between h-(--header-height) pl-4 md:pl-6 pr-2 bg-sidebar border-b dark:border-0 lg:border-0 lg:dark:border-0">
      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/home" className="-m-6 p-6">
          <IkkiLogo className="h-3 md:h-4 w-auto " />
        </Link>
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
