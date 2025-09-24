import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pageSizeInfo } from "@/constants/search";

import { useWcStore } from "@/stores/wc-store";
import { ChevronDown } from "lucide-react";

export default function ItemsPerPageSelect() {
  const itemNum = useWcStore((e) => e.pageSize);
  const setItemNum = useWcStore((e) => e.setPageSize);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"secondary"}
          className={"w-[100px] justify-between"}
          size={"default"}
        >
          <div className="flex items-center gap-2">
            <div className="font-normal">{pageSizeInfo[itemNum].title}</div>
          </div>
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={`${itemNum}`}
          onValueChange={(e: string) => setItemNum(Number(e))}
        >
          {pageSizeInfo.map(({ title }, i) => (
            <DropdownMenuRadioItem value={`${i}`} key={i}>
              {title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
