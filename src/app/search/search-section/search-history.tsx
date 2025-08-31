import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useWcStore } from "@/stores/wc-store";

export default function SearchHistory() {
  const searchHistory = useWcStore((e) => e.searchHistory);
  const onClickHistory = useWcStore((e) => e.onClickHistory);
  return (
    <div className="px-4 pt-4 pb-10 md:px-6">
      <ScrollArea className="pb-4">
        <div className="flex w-full gap-2">
          {searchHistory.map((item, i) => (
            <Button
              onClick={() => onClickHistory(i)}
              key={i}
              variant="outline"
              size="sm"
              className="text-muted-foreground rounded-full"
            >
              {item}
            </Button>
          ))}
        </div>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
