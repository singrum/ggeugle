import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { threadSelectArr, threadSelectInfo } from "@/constants/search";
import { useWcStore } from "@/stores/wc-store";
import { ChevronDown } from "lucide-react";
export default function MaxThreadNumSelect() {
  const maxThreadValue = useWcStore((e) => e.maxThreadValue);
  const setMaxThreadValue = useWcStore((e) => e.setMaxThreadValue);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="gap-4">
          <div>
            동시 탐색:{" "}
            <span className="font-normal">
              {threadSelectInfo[maxThreadValue].title}
            </span>
          </div>
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={`${maxThreadValue}`}
          onValueChange={(e: string) => setMaxThreadValue(e)}
        >
          {threadSelectArr.map((e) => (
            <DropdownMenuRadioItem value={e} key={e}>
              {threadSelectInfo[e].title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
