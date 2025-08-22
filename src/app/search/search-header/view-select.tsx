import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { viewInfo } from "@/constants/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWcStore } from "@/stores/wc-store";
import { ArrowUpRight, ChevronsUpDown } from "lucide-react";
import { NavLink } from "react-router";
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
        <DropdownMenuLabel>
          <NavLink
            to="/knowledge/%EB%91%90%EC%9D%8C%20%EB%B2%95%EC%B9%99%20%EB%81%9D%EB%A7%90%EC%9E%87%EA%B8%B0/%EC%9D%B4%EB%B6%84%20%EC%9C%A0%ED%96%A5%20%EA%B7%B8%EB%9E%98%ED%94%84%20%EB%AA%A8%EB%8D%B8"
            className="text-primary flex w-auto items-start text-sm font-medium"
          >
            음절 위치
            <ArrowUpRight className="mt-0.5 ml-0.5 inline-flex size-3" />
          </NavLink>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
