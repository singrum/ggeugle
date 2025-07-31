import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { MoveType } from "@/types/search";
import { ChevronsUpDown } from "lucide-react";

const directionOption = ["다음 단어", "이전 단어"];
export default function DirectionSettings({
  direction,
  setDirection,
  setSort,
}: {
  direction: 0 | 1;
  setDirection: (type: 0 | 1) => void;
  setSort: (sort: { key: "total" | MoveType; desc: boolean }) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("w-auto justify-between font-normal")}
        >
          <div className="flex items-center gap-2">
            {directionOption[direction]}
          </div>
          {<ChevronsUpDown className="size-3" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={`${direction}`}
          onValueChange={(e: string) => {
            setDirection(Number(e) as 0 | 1);
            setSort({ key: "total", desc: true });
          }}
        >
          {directionOption.map((_, i) => (
            <DropdownMenuRadioItem value={`${i}`} key={`${i}`}>
              {directionOption[i]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
