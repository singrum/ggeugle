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

import { Button } from "@/components/ui/button";
import { etcMenu } from "@/EtcNavBar";
import { Menu, SquareArrowOutUpRight, X } from "lucide-react";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa6";

export default function Header({ className }: { className?: string }) {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div className={cn("flex flex-col min-h-9 z-10", className)}>
      {showAlert && (
        <div
          className="text-xs flex justify-between text-white bg-[#5865F2] cursor-pointer font-semibold items-center"
          onClick={() => {
            setShowAlert(false);
          }}
        >
          {/* <div className=" rounded-md bg-white  px-1.5 py-0.5 text-xs leading-none text-[#5865F2]  no-underline group-hover:no-underline">
          New
        </div> */}
          <div className="p-1 invisible">
            <X className="w-4 h-4" />
          </div>
          <div
            className="flex  gap-1 items-center  p-1"
            onClick={(e) => {
              e.stopPropagation();
              open("https://discord.gg/bkHgyajx89");
            }}
          >
            <SquareArrowOutUpRight className="h-3 w-3" strokeWidth="2.5" />
            끄글 디스코드가 개설되었습니다.
          </div>
          <div className="p-1">
            <X className="w-4 h-4" />
          </div>
        </div>
      )}
      <div className="flex w-full justify-between items-center">
        <div
          className="flex items-end gap-1 px-3 py-2"
          onClick={() => {
            location.reload();
          }}
        >
          <Logo />
        </div>
        <div className="flex items-center">
          <Button size="icon" variant={"ghost"}>
            <FaDiscord className="h-5 w-5 md:h-4 md:w-4" strokeWidth={1.5} />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </Button>
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
    </div>
  );
}
