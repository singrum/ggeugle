import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NavBar from "@/NavBar";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import { EtcDropdown } from "@/App";
import { cn } from "@/lib/utils";
import { useMenu } from "@/lib/store/useMenu";
export default function Header() {
  const menu = useMenu((e) => e.menu);
  return (
    <div
      className={cn("top-0 flex flex-col min-h-9 z-0 ", {
        "bg-muted/40": menu.index === 1 || menu.index === 2,
      })}
    >
      <div className="flex w-full items-end p-2 gap-1">
        <Logo />
        <div className="text-muted-foreground mb-1 text-xs">
          끝말잇기 검색기
        </div>
        {/* <EtcDropdown /> */}
      </div>
    </div>
  );
}
