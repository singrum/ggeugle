import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { viewInfo } from "@/constants/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWcStore } from "@/stores/wc-store";
import { ChevronsUpDown } from "lucide-react";
export default function ViewSelect() {
  const view = useWcStore((e) => e.view);
  const setView = useWcStore((e) => e.setView);
  const isMobile = useIsMobile();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isMobile ? "outline" : "ghost"}
          className={"w-auto justify-between"}
          size={"default"}
        >
          <div className="flex items-center gap-2">
            {!isMobile && "음절 위치:"}
            <div className="font-normal">{viewInfo[view].title}</div>
          </div>
          <ChevronsUpDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-50">
        <DropdownMenuRadioGroup
          value={`${view}`}
          onValueChange={(e: string) => setView(Number(e) as 0 | 1)}
        >
          {viewInfo.map(({ title }, i) => (
            <DropdownMenuRadioItem value={`${i}`} key={i}>
              {title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
