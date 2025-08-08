import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExceptedWordButton } from "@/components/words-section/word-button";
import { useWcStore } from "@/stores/wc-store";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  FolderSync,
  Loader,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";

export default function ExceptedWords() {
  const exceptedWords = useWcStore((e) => e.exceptedWords);
  const exceptedWordsLoading = useWcStore((e) => e.exceptedWordsLoading);

  return (
    <div className="p-1 pb-0">
      {exceptedWords.length === 0 ? (
        <div className="text-muted-foreground mb-4 flex items-start gap-2 p-3 pb-0 text-sm">
          <div className="min-h-5">제외 단어 없음. (띄어쓰기로 구분)</div>
        </div>
      ) : (
        <div>
          <div className="bg-foreground/5 rounded-lg rounded-b-xs">
            <div className="text-muted-foreground flex items-center gap-2 p-3 text-sm">
              제외 단어
            </div>
            <div className="flex flex-wrap items-center gap-1 p-2 pt-0 md:gap-1.5 md:p-3 md:pt-0">
              <AnimatePresence>
                <>
                  {exceptedWords.map((e) => (
                    <motion.div
                      key={e}
                      layout
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExceptedWordButton key={e}>{e}</ExceptedWordButton>
                    </motion.div>
                  ))}
                  {exceptedWordsLoading ? (
                    <motion.div
                      key={"loader"}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex size-8 items-center justify-center">
                        <Loader className="stroke-primary size-5 animate-spin" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={"loader"}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ExceptWordsDropDown />
                    </motion.div>
                  )}
                </>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExceptWordsDropDown() {
  const setExceptedWords = useWcStore((e) => e.setExceptedWords);
  const exceptedWords = useWcStore((e) => e.exceptedWords);
  const syncRule = useWcStore((e) => e.syncRule);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:dark:bg-foreground/5 hover:bg-foreground/5 size-8 rounded-full"
        >
          <MoreHorizontal className="stroke-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setExceptedWords([]);
          }}
        >
          <RotateCcw />
          초기화
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(exceptedWords.join(" "));
          }}
        >
          <Copy /> 복사
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            syncRule();
          }}
        >
          <FolderSync /> 룰에 반영하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
