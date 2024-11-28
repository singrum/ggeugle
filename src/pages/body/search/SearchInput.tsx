import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useRefs } from "@/lib/store/useRefs";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import {
  Check,
  Clipboard,
  CornerRightUp,
  LoaderCircle,
  Plus,
  RotateCcw,
  Search,
  Settings,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import DownloadDialog from "./DownloadDialog";

export default function SearchInput() {
  return (
    <div className="p-4 mb-5">
      <div className="px-2">
        <SearchTitle />
      </div>
      <div className="overflow-auto scrollbar-none w-full">
        <div className="mt-4 px-2 flex gap-2 whitespace-nowrap">
          <DownloadDialog />
          <Badge
            onClick={() =>
              document.getElementById("search-settings-dialog-open")!.click()
            }
            variant={"secondary"}
            className="gap-1 cursor-pointer select-none py-1"
          >
            <Settings className="h-4 w-4" />
            검색 환경설정
          </Badge>
        </div>
      </div>
      <ExceptWordsDisplay />
      <WordInput />
    </div>
  );
}

function SearchTitle() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">검색</h1>
        <div className="text-sm text-muted-foreground">
          <div className="">
            끝말잇기에서 사용 가능한 단어들을 검색하고, 필승 전략을 탐색합니다.
          </div>
        </div>
      </div>
    </>
  );
}

function ExceptWordsDisplay() {
  const [
    setValue,
    setSearchInputValue,
    exceptWords,
    setExceptWords,
    engine,
    isLoading,
    changeInfo,
  ] = useWC((e) => [
    e.setValue,
    e.setSearchInputValue,
    e.exceptWords,
    e.setExceptWords,
    e.engine,
    e.isLoading,
    e.changeInfo,
  ]);
  const [showToast, exceptBy] = useCookieSettings((e) => [
    e.showToast,
    e.exceptBy,
  ]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [clipComplete, setClipComplete] = useState(false);
  return (
    <div className="mt-8 min-h-12 w-full rounded-xl border-border border">
      <div className="flex items-center justify-between w-full py-2 px-2 pl-3 rounded-t-xl">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Popover>
            <PopoverTrigger className=" underline-offset-4 underline decoration-dashed hover:no-underline font-medium">
              제외 단어
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              단어를 입력하고{" "}
              <span className="font-semibold">
                {exceptBy === "space" ? "띄어쓰기" : "엔터"}
              </span>
              나{" "}
              <span className="font-semibold">
                <CornerRightUp
                  className="inline w-3.5 h-3.5 mb-0.5"
                  strokeWidth={2.5}
                />{" "}
                버튼
              </span>
              을 클릭하여 그 단어를{" "}
              <span className="font-semibold">단어 목록에서 제외</span>할 수
              있습니다.
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex items-center gap-1 border border-border rounded-md h-8 px-1 bg-background">
            {[
              {
                name: "복사",
                icon: clipComplete ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Clipboard className="w-4 h-4" />
                ),
                onClick: () => {
                  if (exceptWords.length > 0) {
                    navigator.clipboard.writeText(exceptWords.join(" "));
                  }
                  setClipComplete(true);

                  setTimeout(() => {
                    setClipComplete(false);
                  }, 2000);
                },
              },
              {
                name: "초기화",
                icon: <RotateCcw className="w-4 h-4" />,
                onClick: () => {
                  exceptWords.length > 0 && engine && setExceptWords([]);
                },
              },
            ].map(({ name, icon, onClick }, i) => (
              <React.Fragment key={name}>
                <Button
                  size={"icon"}
                  className="h-6 w-6 border-none"
                  variant={"outline"}
                  onClick={onClick}
                >
                  {icon}
                </Button>
                {i === 0 && (
                  <Separator orientation="vertical" className="h-5" />
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            className="h-8 px-2 text-sm"
            variant="outline"
            onClick={() =>
              document.getElementById("changed-char-dialog-open")?.click()
            }
          >
            비교
            {Object.keys(changeInfo.compPrev).length > 0 && (
              <div className="ml-1.5 rounded-md bg-primary px-1.5 py-0.5 text-xs leading-none text-primary-foreground no-underline group-hover:no-underline">
                {Object.keys(changeInfo.compPrev).length}
              </div>
            )}
          </Button>
        </div>
      </div>
      <Separator />
      <div className=" rounded-b-xl ">
        <div
          className={cn("flex flex-wrap gap-x-1 gap-y-1 items-center p-3", {
            "p-2": exceptWords.length > 0,
          })}
        >
          {exceptWords.length > 0 ? (
            <>
              {exceptWords.map((e) => (
                <button
                  className="transition-colors rounded-full flex items-center border border-foreground/40 cursor-pointer"
                  key={e}
                  onClick={() => {
                    const head = e.at(engine!.rule.headIdx)!;
                    setValue(head);
                    setSearchInputValue(head);
                  }}
                >
                  <div className="py-0.5 pl-3 pr-1 text-muted-foreground hover:text-foreground font-medium">
                    {e}
                  </div>
                  <div
                    className="flex items-center justify-center rounded-full cursor-pointer py-1 pr-1 text-muted-foreground hover:text-foreground"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setExceptWords([...exceptWords.filter((ex) => ex !== e)]);
                    }}
                  >
                    <div className="flex items-center justify-center rounded-full h-5 w-5 hover:bg-muted-foreground/10">
                      <Plus className="w-3.5 h-3.5" strokeWidth="3" />
                    </div>
                  </div>
                </button>
              ))}
              {exceptWords.length > 0 && !(engine && isLoading) && (
                <div className=" flex justify-end items-center gap-2 pb-0 ml-2"></div>
              )}
            </>
          ) : (
            !(engine && isLoading) && (
              <div className="flex items-center">
                <div className="text-muted-foreground text-sm">
                  제외한 단어가 없습니다.
                </div>
              </div>
            )
          )}

          {engine && isLoading && (
            <LoaderCircle className="ml-1 w-6 h-6 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>
      <Toaster
        containerClassName={cn({ hidden: !showToast })}
        position={isDesktop ? "bottom-right" : "top-right"}
        toastOptions={{
          className: "bg-white text-black",
        }}
      />
    </div>
  );
}

function WordInput() {
  const [
    value,
    setValue,
    setSearchInputValue,
    exceptWords,
    setExceptWords,
    engine,
    searchInputValue,
  ] = useWC((e) => [
    e.value,
    e.setValue,
    e.setSearchInputValue,
    e.exceptWords,
    e.setExceptWords,
    e.engine,
    e.searchInputValue,
  ]);
  const [exceptBy] = useCookieSettings((e) => [e.exceptBy]);
  const [inputRef, setInputRef] = useRefs((e) => [e.inputRef, e.setInputRef]);
  const inputRefTemp = useRef<HTMLInputElement>(null);
  const debounced = useDebouncedCallback((value) => {
    setSearchInputValue(value);
  }, 150);

  useEffect(() => {
    debounced.cancel();
  }, [searchInputValue]);
  useEffect(() => {
    if (inputRefTemp.current) setInputRef(inputRefTemp.current);
  }, [inputRefTemp.current]);

  const onExceptTriggered = () => {
    if (engine && value.length > 1) {
      setValue("");
      setSearchInputValue("");
      const newExcept = value
        .split(/\s+/)
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
  };

  return (
    <div className="pt-2">
      <div className="relative">
        <Input
          ref={inputRefTemp}
          className="border border-border rounded-xl h-12 text-md pl-10 pr-12 focus-visible:outline-offset-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/50 transition-colors"
          value={value}
          type="search"
          placeholder="글자 또는 단어를 입력하세요."
          onKeyDown={(e) => {
            if (exceptBy === "enter" && e.key == "Enter") {
              if (e.nativeEvent.isComposing) {
                return;
              }
              onExceptTriggered();
            }
          }}
          onChange={(e) => {
            e.preventDefault();
            if (
              exceptBy === "space" &&
              e.target.value[e.target.value.length - 1] === " "
            ) {
              onExceptTriggered();
            } else {
              debounced(e.target.value.split(/\s+/).at(-1));
              setValue(e.target.value);
            }
          }}
        />

        <Search className="w-[1.2rem] h-[1.2rem] absolute left-3 top-[calc(50%-0.6rem)] text-muted-foreground" />

        <div className="flex items-center justify-center gap-2 absolute right-3 top-[calc(50%-0.75rem)] w-[1.5rem] h-[1.5rem]">
          <div
            className={cn(
              "flex items-center justify-center rounded-full w-[2.0rem] h-[2.0rem] cursor-pointer text-muted-foreground ",
              { "text-foreground": value.length > 1 }
            )}
            onClick={() => {
              onExceptTriggered();
            }}
          >
            <CornerRightUp className="w-[1.4rem] h-[1.4rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
