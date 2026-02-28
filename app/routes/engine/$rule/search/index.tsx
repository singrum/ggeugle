import { ScrollArea } from "~/components/ui/scroll-area";
import { useIsTablet } from "~/hooks/use-tablet";
import CharListSidebar from "~/routes/engine/$rule/search/+components/char-list-sidebar/char-list-sidebar";
import MobileCharMenu from "~/routes/engine/$rule/search/+components/char-list-sidebar/char-menu";
import InnerSidebar from "../+components/inner-sidebar/inner-sidebar";
import SearchPage from "./+components/search-page";

export default function Search() {
  const isTablet = useIsTablet();
  return (
    <div className="flex h-full max-w-full overflow-auto">
      {!isTablet && (
        <InnerSidebar>
          <MobileCharMenu className="sticky top-0 z-20" />
          <CharListSidebar />
        </InnerSidebar>
      )}
      <ScrollArea className="md:flex-1 md:h-full w-full @container/main">
        <SearchPage />
      </ScrollArea>
    </div>
  );
}
