import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
} from "@/components/ui/ghost-tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { searchResultMenuInfo } from "@/constants/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";

export default function SearchResultMenu() {
  const searchResultMenu = useWcStore((e) => e.searchResultMenu);
  const setSearchResultMenu = useWcStore((e) => e.setSearchResultMenu);
  const searchInputType = useWcStore((e) => e.searchInputType);
  const isMobile = useIsMobile();
  return (
    <ScrollArea className="w-full">
      <GhostTabs
        className={cn("w-auto px-4 py-2.5 whitespace-nowrap md:px-6", {
          "shadow-[inset_0_-1px_0_0_var(--border)]": isMobile,
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
