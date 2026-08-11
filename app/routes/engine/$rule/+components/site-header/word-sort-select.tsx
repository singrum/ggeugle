import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { wordDispTypeInfo, wordSortTypeInfo } from "~/constants/search";

import { ChevronDown } from "lucide-react";
import { useWcStore } from "~/stores/wc-store-provider";
export default function WordSortSelect() {
  const wordSortType = useWcStore((e) => e.wordSortType);
  const setWordSortType = useWcStore((e) => e.setWordSortType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"secondary"}
          className={"w-[100px] justify-between"}
          size={"default"}
        >
          <div className="flex items-center gap-2">
            <div className="font-normal">
              {wordSortTypeInfo[wordSortType].title}
            </div>
          </div>
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={`${wordSortType}`}
          onValueChange={(e: string) => setWordSortType(Number(e))}
        >
          {wordSortTypeInfo.map(({ title }, i) => (
            <DropdownMenuRadioItem value={`${i}`} key={i}>
              {title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
