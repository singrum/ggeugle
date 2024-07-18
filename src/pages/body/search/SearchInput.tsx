import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/store/useSearch";
import { useWC } from "@/lib/store/useWC";
import { ArrowBigUp, Minus, Plus, SquareMinus, X } from "lucide-react";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
export default function SearchInput() {
  const value = useSearch((e) => e.value);
  const setValue = useSearch((e) => e.setValue);
  const exceptWords = useSearch((e) => e.exceptWords);
  const setExceptWords = useSearch((e) => e.setExceptWords);
  const words = useWC((e) => e.words);
  const worker = useWC((e) => e.worker);
  const debounced = useDebouncedCallback((value) => {
    worker!.postMessage({
      action: "getWordClass",
      data: value,
    });
  }, 300);

  return (
    <div className="border border-border rounded-md p-3 flex flex-col gap-2 bg-muted/40">
      <div className="flex gap-1 items-center">
        <div>제외할 단어</div>
        <div className="text-muted-foreground">{`(띄어쓰기로 구분)`}</div>
        {exceptWords.length > 0 && (
          <div
            className="text-los/70 cursor-pointer rounded-md hover:text-los ml-1"
            onClick={() => {
              worker!.postMessage({
                action: "setWords",
                data: { words: exceptWords, operation: "add" },
              });
              setExceptWords([]);
            }}
          >
            모두 삭제
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-1 gap-y-1">
        {exceptWords.map((e) => (
          <div
            className="transition-colors hover:border-foreground ground rounded-full flex px-1 items-center gap-1 border border-foreground/40 cursor-pointer"
            key={e}
          >
            <div className="pl-2 text-muted-foreground">{e}</div>
            <div
              className="flex items-center justify-center rounded-full h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => {
                setExceptWords([...exceptWords.filter((ex) => ex !== e)]);
                worker!.postMessage({
                  action: "setWords",
                  data: { words: [e], operation: "add" },
                });
              }}
            >
              <X className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={value}
          placeholder="글자 또는 단어를 입력하세요."
          onChange={(e) => {
            e.preventDefault();
            if (e.target.value[e.target.value.length - 1] === " ") {
              setValue("");
              const newExcept = value
                .split(" ")

                .filter(
                  (word, i, arr) =>
                    word.length > 0 &&
                    arr.indexOf(word) === i &&
                    !exceptWords.includes(word) &&
                    words!.has(word)
                );
              setExceptWords([...exceptWords, ...newExcept]);
              worker!.postMessage({
                action: "setWords",
                data: { words: newExcept, operation: "remove" },
              });

              setValue("");
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
