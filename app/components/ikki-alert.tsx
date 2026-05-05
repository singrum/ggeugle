"use client";

import { ChevronRight, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useIsMounted } from "~/hooks/use-is-mounted";
import IkkiLogo from "~/routes/home/+components/ikki-logo";
import { useIkkiAlertStore } from "~/stores/ikki-alert-store";
import { Button } from "./ui/button";

const EXPIRE_TIME = 24 * 60 * 60 * 1000;

export default function IkkiAlert() {
  const open = useIkkiAlertStore((state) => state.open);
  const updatedAt = useIkkiAlertStore((state) => state.updatedAt);
  const setOpen = useIkkiAlertStore((state) => state.setOpen);
  const mounted = useIsMounted();

  // 만료 체크 로직
  useEffect(() => {
    console.log("⏰ 만료 체크 실행", { mounted, open, updatedAt });
    if (mounted && !open && updatedAt) {
      const currentTime = Date.now();
      console.log(currentTime - updatedAt);
      if (currentTime - updatedAt > EXPIRE_TIME) {
        console.log("⏰ 만료됨: 알림창을 다시 활성화합니다.");
        setOpen(true);
      }
    }
  }, [mounted, open, updatedAt, setOpen]);

  if (!mounted || !open) {
    return null;
  }

  return (
    <a
      className="bg-[#302e2f] text-[#d9d9d6] font-semibold w-full z-49 fixed bottom-2 left-2 flex max-w-xs rounded-lg shadow-lg overflow-hidden"
      href="https://ikki.app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex relative h-full w-full flex-col">
        <div className="flex justify-center items-center pb-6 pt-8 flex-col gap-6">
          <IkkiLogo className="h-8 text-[#6eaf4b]" />
          <div className="flex items-center gap-1">
            끝말잇기 하러 가기 <ChevronRight className="size-4" />
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
          <XCircle className="size-6 stroke-[#d9d9d6] stroke-1" />
        </Button>
      </div>
    </a>
  );
}
