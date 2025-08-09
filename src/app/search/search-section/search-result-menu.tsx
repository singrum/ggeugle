import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
} from "@/components/ui/ghost-tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { searchResultMenuInfo } from "@/constants/search";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";

export default function SearchResultMenu() {
  const searchResultMenu = useWcStore((e) => e.searchResultMenu);
  const setSearchResultMenu = useWcStore((e) => e.setSearchResultMenu);
  const searchInputType = useWcStore((e) => e.searchInputType);

  return (
    <ScrollArea className="mx-2 md:mx-4">
      <GhostTabs
        className={cn("w-auto px-2 py-3.5 pt-5 whitespace-nowrap md:px-2", {
          "shadow-[inset_0_-1px_0_0_var(--border)]": true,
        })}
        value={`${searchResultMenu}`}
      >
        <GhostTabsList>
          {searchResultMenuInfo[searchInputType].map(({ title }, i) => (
            <GhostTabsTrigger
              key={title}
              value={`${i}`}
              onClick={() => {
                setSearchResultMenu(i);
              }}
            >
              {title}
            </GhostTabsTrigger>
          ))}
        </GhostTabsList>
      </GhostTabs>
      <ScrollBar orientation="horizontal" hidden />
    </ScrollArea>
  );
}
