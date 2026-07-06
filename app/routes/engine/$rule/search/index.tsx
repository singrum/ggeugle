import { ScrollArea } from "~/components/ui/scroll-area";
import { useIsTablet } from "~/hooks/use-tablet";
import CharListSidebar from "~/routes/engine/$rule/search/+components/char-list-sidebar/char-list-sidebar";
import MobileCharMenu from "~/routes/engine/$rule/search/+components/char-list-sidebar/char-menu";
import InnerSidebar from "../+components/inner-sidebar/inner-sidebar";
import SearchPage from "./+components/search-page";

export default function Search() {
  const isTablet = useIsTablet();
  return (
    <div className="flex h-full max-w-full lg:overflow-auto">
      {!isTablet && (
        <InnerSidebar className="flex flex-col">
          <MobileCharMenu className="" />
          <CharListSidebar />
        </InnerSidebar>
      )}
      {!isTablet ? (
        <ScrollArea className="lg:flex-1 lg:h-full w-full @container/main">
          <SearchPage />
        </ScrollArea>
      ) : (
        <SearchPage />
      )}
    </div>
  );
}
