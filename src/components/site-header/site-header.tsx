import SearchPrecedenceSettings from "@/app/search/search-header/search-precedence-settings";
import SearchSettings from "@/app/search/search-header/search-settings";
import ViewSelect from "@/app/search/search-header/view-select";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { RuleButton } from "./rule-button";

export default function SiteHeader() {
  const isMobile = useIsMobile();
  return (
    <header className="bg-sidebar sticky top-0 z-50 flex w-full items-center">
      <div className="flex h-(--header-height) w-full items-center gap-4 px-6">
        {/* <Cog className="stroke-muted-foreground" /> */}
        <RuleButton />
        {isMobile && <Separator orientation="vertical" className="mx-1 h-4!" />}
        <div className="flex items-center gap-1">
          {!isMobile && (
            <>
              <ViewSelect />
              <Separator orientation="vertical" className="h-4!" />
            </>
          )}
          <SearchPrecedenceSettings />
          <SearchSettings />
        </div>
      </div>
    </header>
  );
}
