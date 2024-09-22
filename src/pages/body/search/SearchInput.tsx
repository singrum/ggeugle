import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import {
  Ban,
  Check,
  CirclePlus,
  Clipboard,
  LoaderCircle,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
  return (
    <div className="p-4">
      <div className="px-2">
        <SearchTitle />
      </div>
      <ExceptWordsDisplay />

      <WordInput />
    </div>
  );
}

function SearchTitle() {
  const [exceptBy] = useCookieSettings((e) => [e.exceptBy]);
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold text-xl">검색</span>
      <div className="text-sm text-muted-foreground">
        단어를 입력하고 {exceptBy === "space" ? "띄어쓰기" : "엔터"}나{" "}
        <CirclePlus
          className="inline w-4 h-4 align-text-middle"
          strokeWidth={1.75}
        />{" "}
        버튼을 클릭하여 단어를 제거할 수 있습니다.
      </div>
    </div>
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
  const [showToast] = useCookieSettings((e) => [e.showToast]);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [clipComplete, setClipComplete] = useState(false);
  return (
    <div className="mt-4 min-h-12 w-full rounded-lg border-border border shadow">
      <div className="flex items-center justify-between w-full py-2.5 px-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Ban className="w-3.5 h-3.5" />
          <div className="flex justify-center">제거된 단어</div>
        </div>
        <div className="flex items-center gap-2">
          {[
            {
              name: "복사",
              icon: clipComplete ? (
                <Check className="w-3 h-3" />
              ) : (
                <Clipboard className="w-3 h-3" />
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
              icon: <Trash2 className="w-3 h-3" />,
              onClick: () => {
                exceptWords.length > 0 && engine && setExceptWords([]);
              },
            },
          ].map(({ name, icon, onClick }) => (
            <Button
              key={name}
              size={"icon"}
              className="h-6 w-6 "
              variant={"outline"}
              onClick={onClick}
            >
              {icon}
            </Button>
          ))}
          <Separator orientation="vertical" className="h-5" />
          <Button
            className={cn("h-6 px-2 text-xs", {
              "pr-1": Object.keys(changeInfo.compPrev).length > 0,
            })}
            variant={"outline"}
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
      <div className=" rounded-b-lg ">
        <div className="flex flex-wrap gap-x-1 gap-y-1 items-center p-3 ">
          {exceptWords.length > 0 ? (
            <>
              {exceptWords.map((e) => (
                <div
                  className="transition-colors rounded-full flex px-1 items-center border border-foreground/40 cursor-pointer"
                  key={e}
                  onClick={() => {
                    const head = e.at(engine!.rule.headIdx)!;
                    setValue(head);
                    setSearchInputValue(head);
                  }}
                >
                  <div className="pl-2 text-muted-foreground select-none hover:text-foreground">
                    {e}
                  </div>
                  <div
                    className="flex items-center justify-center rounded-full h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setExceptWords([...exceptWords.filter((ex) => ex !== e)]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </div>
                </div>
              ))}
              {exceptWords.length > 0 && !(engine && isLoading) && (
                <div className=" flex justify-end items-center gap-2 pb-0 ml-2"></div>
              )}
            </>
          ) : (
            !(engine && isLoading) && (
              <div className="flex items-center">
                <div className="text-muted-foreground text-sm">
                  제거된 단어가 없습니다.
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
          className: "bg-white border border-border text-black",
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

  const debounced = useDebouncedCallback((value) => {
    if (engine) {
      setSearchInputValue(value);
    }
  }, 300);
  useEffect(() => {
    debounced.cancel();
  }, [searchInputValue]);

  const onExceptTriggered = () => {
    if (engine) {
      setValue("");
      setSearchInputValue("");
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
  };
  return (
    <div className="pt-4">
      <div className="relative">
        <Input
          className="border border-border rounded-lg h-12 bg-background text-md pl-10 pr-12 focus-visible:outline-offset-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-0 focus-visible:ring-offset-0 shadow"
          value={value}
          type="search"
          placeholder="글자 또는 단어를 입력하세요."
          onKeyDown={(e) => {
            if (e.key == "Enter") {
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
              debounced(e.target.value.split(" ").at(-1));
              setValue(e.target.value);
            }
          }}
        />

        <Search className="w-[1.2rem] h-[1.2rem] absolute left-3 top-[calc(50%-0.6rem)] text-muted-foreground" />

        <div className="flex items-center justify-center gap-2 absolute right-3 top-[calc(50%-0.75rem)] w-[1.5rem] h-[1.5rem]">
          <div
            className={cn(
              "flex items-center justify-center rounded-full w-[2.0rem] h-[2.0rem] cursor-pointer text-muted-foreground transition-colors",
              { "text-foreground": value.length > 0 }
            )}
            onClick={() => {
              if (engine) {
                setValue("");
                setSearchInputValue("");
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
            }}
          >
            <CirclePlus className="w-[1.5rem] h-[1.5rem]" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
