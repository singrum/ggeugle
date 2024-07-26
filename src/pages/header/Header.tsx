import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NavBar from "@/NavBar";
import { Menu } from "lucide-react";
import Logo from "./Logo";
export default function Header() {
  return (
    <div className="border-b border-border sticky top-0 flex flex-col min-h-9 z-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center justify-between p-1">
        <Logo />
        <div
          className="cursor-pointer hover:ring-1 hover:ring-ring p-1 rounded-md"
          onClick={() => {
            document.getElementById("menu-accordian")?.click();
          }}
        >
          <Menu className="w-5 h-5" />
        </div>
      </div>
      <div className="">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="hidden absolute">
              <div id="menu-accordian" className="absolute hidden" />
            </AccordionTrigger>
            <AccordionContent className="p-0 overflow-auto scrollbar-none">
              <div className="flex p-2">
                <NavBar />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
