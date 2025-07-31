import { HandHeartIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function DonationToast() {
  const [showFirst, setShowFirst] = useState(true);
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-1/2 z-100 w-full -translate-x-1/2 md:mt-2 md:w-xl"
        >
          <motion.div
            layout
            className="bg-primary text-primary-foreground flex gap-4 rounded-xl border p-6 shadow-xl"
          >
            <AnimatePresence mode="wait">
              {showFirst ? (
                <motion.div
                  key="first"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="flex flex-1 items-start gap-4"
                >
                  <HandHeartIcon className="size-8" />
                  <div className="flex-1 space-y-2 text-sm">
                    <p className="font-bold">
                      개발자에게 커피 한 잔 후원해주세요!
                    </p>
                    <p>
                      제 웹사이트가 도움이 되었다면, 후원으로 응원 부탁드립니다.
                      :)
                    </p>
                    <Button
                      className="bg-primary-foreground hover:bg-primary-foreground/90 mt-4 text-black"
                      onClick={() => setShowFirst(false)}
                    >
                      후원하기
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="second"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="flex-1 text-sm"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <p>아래 링크를 통해 후원하실 수 있어요.</p>
                    <p className="text-xs">
                      * 본 링크는 모바일 기기에서만 작동합니다.
                    </p>
                    <a
                      href="https://qr.kakaopay.com/FX4DYDzM63e805323"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-foreground font-medium underline"
                    >
                      https://qr.kakaopay.com/FX4DYDzM63e805323
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-foreground/5 -m-2"
              onClick={() => setOpen(false)}
              aria-label="닫기"
            >
              <XCircle className="stroke-primary-foreground size-5" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
