import { InsetHeader, InsetHeaderLeft } from "@/components/inset-header";

import { useIsMobile } from "@/hooks/use-mobile";

import { Separator } from "@/components/ui/separator";
import SearchPrecedenceSettings from "./search-precedence-settings";
import SearchSettings from "./search-settings";
import ViewSelect from "./view-select";
export default function SearchHeader() {
  const isMobile = useIsMobile();
  return (
    <div className="space-y-6 px-4 py-4 md:px-6">
      <InsetHeader>
        <InsetHeaderLeft />

        <Separator orientation="vertical" className="mx-1 h-4!" />
        <div className="bg-background flex items-center gap-1">
          {!isMobile && (
            <>
              <ViewSelect />
              <Separator orientation="vertical" className="h-4!" />
            </>
          )}
          <SearchPrecedenceSettings />
          <SearchSettings />
        </div>
      </InsetHeader>
    </div>
  );
}
