"use client";

import { ChevronRight, X } from "lucide-react";
import { useIsMounted } from "~/hooks/use-is-mounted";
import { useAlertStore } from "~/stores/alert-store";
import { Button } from "./ui/button";

const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;

export default function IkkiAlert() {
  const open = useAlertStore((state) => state.open);
  const updatedAt = useAlertStore((state) => state.updatedAt);
  const setOpen = useAlertStore((state) => state.setOpen);
  const mounted = useIsMounted();

  if (!mounted || !open) {
    return null;
  }

  return (
    <a
      className="bg-[#302e2f] text-[#d9d9d6] font-semibold w-full z-49 fixed bottom-2 left-2 flex max-w-60 rounded-lg shadow-lg overflow-hidden"
      href="https://ikki.app/daily/incoming"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex relative h-full w-full flex-col">
        <div className="flex justify-center items-center pb-6 pt-8 flex-col gap-4">
          <div className=" text-sm">하루에 한 수씩 두는</div>
          <div className="flex items-center gap-1">
            일일 끝말잇기 하러가기
            <ChevronRight className="size-4" />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          }}
          className="absolute right-1 top-1 hover:bg-transparent dark:hover:bg-transparent cursor-pointer"
        >
          <X className="size-5 stroke-[#d9d9d6] stroke-1" />
        </Button>
      </div>
    </a>
  );
}
