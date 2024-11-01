import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

import { etcMenu } from "@/EtcNavBar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Header({ className }: { className?: string }) {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className={cn("flex flex-col min-h-9 z-10", className)}>
      {showAlert && (
        <div
          className="text-xs flex items-center justify-center gap-2 text-black p-1 bg-[#F3D368] cursor-pointer font-semibold"
          onClick={() => setShowAlert(false)}
        >
          <div className=" rounded-md bg-black  px-1.5 py-0.5 text-xs leading-none text-[#F3D368] no-underline group-hover:no-underline">
            New
          </div>
          끄투코리아 단어팩 추가
        </div>
      )}
      <div className="flex w-full justify-between items-center">
        <div
          className="flex items-end gap-1 px-4 py-2"
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
            <div className="flex justify-center items-center cursor-pointer transition-colors p-2 my-1 mx-1 hover:bg-accent rounded-lg">
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
                  className="flex gap-4 items-center cursor-pointer hover:text-muted-foreground transition-colors text-xl"
                  onClick={() => {
                    onClick_();
                  }}
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
