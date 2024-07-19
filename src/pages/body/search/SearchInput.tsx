import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useWC } from "@/lib/store/useWC";
import { WCDisplay } from "@/lib/wc/wordChain";
import {
  ArrowBigUp,
  CircleAlert,
  EllipsisVertical,
  LoaderCircle,
  Minus,
  Plus,
  SquareMinus,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster, useToaster } from "react-hot-toast";
import { ChangedCharsDialog } from "./ChangedCharsAlert";
export default function SearchInput() {
  // const [value, setValue] = useState("");
  const value = useWC((e) => e.value);
  const setValue = useWC((e) => e.setValue);
  const setSearchInputValue = useWC((e) => e.setSearchInputValue);
  const exceptWords = useWC((e) => e.exceptWords);
  const setExceptWords = useWC((e) => e.setExceptWords);
  const engine = useWC((e) => e.engine);
  const isLoading = useWC((e) => e.isLoading);
  const debounced = useDebouncedCallback((value) => {
    if (engine) {
      setSearchInputValue(value);
    }
  }, 300);

  return (
    <div className="border border-border rounded-md p-3 flex flex-col gap-2 bg-muted/40">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <div>제외된 단어</div>
          <div className="text-muted-foreground">{`(띄어쓰기로 구분)`}</div>
        </div>
        <Toaster
          position={"top-right"}
          toastOptions={{
            className: "bg-background border border-border text-foreground ",
          }}
        />
        <ChangedCharsDialog />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="text-muted-foreground hover:text-foreground">
              <EllipsisVertical strokeWidth={1.5} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                exceptWords.length > 0 && engine && setExceptWords([])
              }
            >
              비우기
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                exceptWords.length > 0 && engine && setExceptWords([])
              }
            >
              클립보드에 복사
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                document.getElementById("changed-char-dialog-open")?.click();
              }}
            >
              변경된 글자 목록
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-x-1 gap-y-1 items-center">
        {exceptWords.map((e) => (
          <div
            className="transition-colors hover:border-foreground  rounded-full flex px-1 items-center gap-1 border border-foreground/40 cursor-pointer"
            key={e}
          >
            <div className="pl-2 text-muted-foreground">{e}</div>
            <div
              className="flex items-center justify-center rounded-full h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() =>
                setExceptWords([...exceptWords.filter((ex) => ex !== e)])
              }
            >
              <X className="h-5 w-5" />
            </div>
          </div>
        ))}

        {engine && isLoading && (
          <LoaderCircle className="w-6 h-6 animate-spin" />
        )}
      </div>
      <div className="flex gap-2">
        <Input
          className=""
          value={value}
          placeholder="글자 또는 단어를 입력하세요."
          onChange={(e) => {
            e.preventDefault();
            if (e.target.value[e.target.value.length - 1] === " ") {
              if (engine) {
                setValue("");
                const newExcept = value
                  .split(" ")
                  .filter(
                    (word, i, arr) =>
                      word.length > 0 &&
                      arr.indexOf(word) === i &&
                      !exceptWords.includes(word) &&
                      engine!.words.includes(word)
                  );
                if (newExcept.length > 0) {
                  const exceptWords_ = [...exceptWords, ...newExcept];

                  setExceptWords(exceptWords_);
                }
              }
            } else {
              debounced(e.target.value);
              setValue(e.target.value);
            }
          }}
        />
        <Button variant={"default"} size="icon">
          <Plus />
        </Button>
      </div>
    </div>
  );
}
