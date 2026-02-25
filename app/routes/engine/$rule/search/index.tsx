import { ScrollArea } from "~/components/ui/scroll-area";
import CharListSidebar from "~/routes/engine/$rule/search/+components/char-list-sidebar/char-list-sidebar";
import MobileCharMenu from "~/routes/engine/$rule/search/+components/char-list-sidebar/char-menu";
import InnerSidebar from "../+components/inner-sidebar/inner-sidebar";
import SearchPage from "./+components/search-page";

export default function Search() {
  return (
    <div className="flex h-full">
      <InnerSidebar>
        <MobileCharMenu className="sticky top-0 z-20" />
        <CharListSidebar />
      </InnerSidebar>
      <ScrollArea className="flex-1 h-full">
        <SearchPage />
      </ScrollArea>
    </div>
  );
}
