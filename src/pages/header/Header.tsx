import { cn } from "@/lib/utils";
import { CgMenuRight } from "react-icons/cg";
import Logo from "./Logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { etcMenu } from "@/EtcNavBar";
import { Menu } from "lucide-react";

export default function Header({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col min-h-9 z-10 px-1 border-b", className)}>
      <div className="flex w-full justify-between items-center">
        <div
          className="flex items-end gap-1 p-2"
          onClick={() => {
            location.reload();
          }}
        >
          <Logo />
          <div className="text-muted-foreground mb-1 text-xs">
            끝말잇기 검색엔진
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex justify-center items-center cursor-pointer transition-colors p-2 hover:bg-accent rounded-lg">
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </div>
          </SheetTrigger>
          <SheetContent className="pt-10">
            <SheetHeader>
              <SheetTitle></SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              {etcMenu.map(({ name, icon, onClick_ }) => (
                <div
                  key={name}
                  className="flex gap-2 items-center cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={onClick_}
                >
                  {icon}
                  <div>{name}</div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
