import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { wordDispTypeInfo } from "@/constants/search";

import { useWcStore } from "@/stores/wc-store";
import { ChevronDown } from "lucide-react";
export default function WordDispSelect() {
  const wordDispType = useWcStore((e) => e.wordDispType);
  const setWordDispType = useWcStore((e) => e.setWordDispType);

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
              {wordDispTypeInfo[wordDispType].title}
            </div>
          </div>
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={`${wordDispType}`}
          onValueChange={(e: string) => setWordDispType(Number(e))}
        >
          {wordDispTypeInfo.map(({ title }, i) => (
            <DropdownMenuRadioItem value={`${i}`} key={i}>
              {title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
