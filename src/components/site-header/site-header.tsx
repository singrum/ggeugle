import SearchPrecedenceSettings from "@/app/search/search-header/search-precedence-settings";
import ViewSelect from "@/app/search/search-header/view-select";

import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "../mode-toggle";
import PreferenceSettings from "./preference-settings";
import { RuleButton } from "./rule-button";

export default function SiteHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="bg-sidebar sticky top-0 z-50 flex w-full items-center">
      <div className="flex h-(--header-height) w-full items-center gap-0 pr-4 pl-2 md:pr-7 md:pl-4">
        <RuleButton />

        <div className="flex items-center gap-1">
          {isMobile && <Separator orientation="vertical" className="h-4!" />}
          {!isMobile && (
            <>
              <ViewSelect />
              <Separator orientation="vertical" className="mx-1 h-4!" />
            </>
          )}

          <SearchPrecedenceSettings />
          <PreferenceSettings />
          {!isMobile && <ModeToggle />}
        </div>
      </div>
    </header>
  );
}
