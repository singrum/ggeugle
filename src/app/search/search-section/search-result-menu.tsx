import {
  LineTabs,
  LineTabsList,
  LineTabsTrigger,
} from "@/components/ui/line-tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { searchResultMenuInfo } from "@/constants/search";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";

export default function SearchResultMenu() {
  const searchResultMenu = useWcStore((e) => e.searchResultMenu);
  const setSearchResultMenu = useWcStore((e) => e.setSearchResultMenu);
  const searchInputType = useWcStore((e) => e.searchInputType);

  return (
    <ScrollArea className="mx-0 md:mx-4">
      <LineTabs
        className={cn("w-auto px-4 py-3 pt-3.5 whitespace-nowrap md:px-2")}
        value={`${searchResultMenu}`}
      >
        <LineTabsList>
          {searchResultMenuInfo[searchInputType].map(({ title }, i) => (
            <LineTabsTrigger
              key={title}
              value={`${i}`}
              onClick={() => {
                setSearchResultMenu(i);
              }}
            >
              {title}
            </LineTabsTrigger>
          ))}
        </LineTabsList>
      </LineTabs>

      <ScrollBar orientation="horizontal" hidden />
    </ScrollArea>
  );
}
