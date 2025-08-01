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
import { useWcStore } from "@/stores/wc-store";
import { ChevronsUpDown } from "lucide-react";
const nodeTypeOption = ["win", "lose", "loopwin", "route"];
export default function NodeTypeSettings() {
  const nodeType = useWcStore((e) => e.distributionNodeType);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("w-auto justify-between font-normal")}
        >
          <div className="flex items-center gap-2">
            <Ball variant={nodeType} />
            {typeMap[nodeType] + " 음절"}
          </div>
          {<ChevronsUpDown className="size-3" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={`${nodeType}`}
          onValueChange={(nodeType: string) => {
            useWcStore.setState((e) => {
              if (e.wordDistributionOption.type === "adjacent") {
                e.wordDistributionOption.sort = { key: "total", desc: true };
              } else {
                e.wordDistributionOption.wordTypes =
                  nodeType === "route" ? [1, 1] : ["total", "total"];
              }
              e.distributionNodeType = nodeType as NodeType;
            });
          }}
        >
          {nodeTypeOption.map((e) => (
            <DropdownMenuRadioItem
              value={e}
              key={e}
              circle={<Ball variant={nodeType} />}
            >
              {typeMap[e as NodeType] + " 음절"}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
