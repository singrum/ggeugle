import { Ball } from "@/components/ball";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { typeMap } from "@/constants/search";
import { cn } from "@/lib/utils";
import type { NodeType } from "@/lib/wordchain/graph/graph";
import type { MoveType } from "@/types/search";
import { ChevronsUpDown } from "lucide-react";
const nodeTypeOption = ["win", "lose", "loopwin", "route"];
export default function TypeSettings({
  type,
  setType,
  setSort,
}: {
  type: NodeType;
  setType: (type: NodeType) => void;
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
            <Ball variant={type} />
            {typeMap[type] + " 음절"}
          </div>
          {<ChevronsUpDown className="size-3" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={`${type}`}
          onValueChange={(e: string) => {
            setSort({ key: "total", desc: true });
            setType(e as NodeType);
          }}
        >
          {nodeTypeOption.map((e) => (
            <DropdownMenuRadioItem
              value={e}
              key={e}
              circle={<Ball variant={type} />}
            >
              {typeMap[e as NodeType] + " 음절"}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
