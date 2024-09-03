import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useWC } from "@/lib/store/useWC";
import { cn } from "@/lib/utils";
import {
  Clipboard,
  CornerRightUp,
  LoaderCircle,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TbStatusChange } from "react-icons/tb";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
  return (
    <div className="p-4">
      <SearchTitle />

      <div className="mt-4 min-h-12 w-full rounded-lg mb-4 border-border border">
        <ExceptWordsDisplay />
      </div>
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
        단어를 입력 후 {exceptBy === "space" ? "띄어쓰기" : "엔터"}나 + 버튼을
        클릭하여 단어를 제거할 수 있습니다.
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
  const [showToast, exceptBy] = useCookieSettings((e) => [
    e.showToast,
    e.exceptBy,
  ]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <div className="grid grid-cols-3 justify-center items-center w-full p-3 rounded-t-lg bg-accent">
        <div />
        <div className="flex justify-center text-foreground text-base font-semibold">
          제거된 단어
        </div>
        <div className="flex items-center gap-2 justify-end">
          {[
            {
              name: "비교",
              onClick: () => {
                document.getElementById("changed-char-dialog-open")?.click();
              },
            },
          ].map(({ name, onClick }, i) => (
            <div key={i}>
              <div
                className="cursor-pointer hover:text-foreground transition-colors text-muted-foreground flex items-center"
                onClick={onClick}
              >
                {i === 0 && Object.keys(changeInfo.compPrev).length > 0 && (
                  <div className="mr-2 rounded-md bg-primary px-1.5 py-0.5 text-xs leading-none text-primary-foreground no-underline group-hover:no-underline">
                    {Object.keys(changeInfo.compPrev).length}
                  </div>
                )}
                {name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div className="bg-muted/40 rounded-b-lg ">
        <div className="flex flex-wrap gap-x-1 gap-y-1 items-center p-3 ">
          {exceptWords.length > 0 ? (
            <>
              {exceptWords.map((e) => (
                <div
                  className="transition-colors hover:border-foreground rounded-full flex px-1 items-center border border-foreground/40 cursor-pointer"
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
                <div className=" flex justify-end items-center gap-2 pb-0 ml-2">
                  {[
                    {
                      name: "복사",
                      onClick: () => {
                        if (exceptWords.length > 0) {
                          navigator.clipboard.writeText(exceptWords.join(" "));
                        }
                      },
                    },
                    {
                      name: "초기화",
                      onClick: () => {
                        exceptWords.length > 0 && engine && setExceptWords([]);
                      },
                    },
                  ].map(({ name, onClick }) => (
                    <div
                      key={name}
                      className="text-muted-foreground hover:text-foreground cursor-pointer select-none"
                      onClick={onClick}
                    >
                      {name}
                    </div>
                  ))}
                </div>
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
            <LoaderCircle className="w-6 h-6 animate-spin" />
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
    </>
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
    <>
      <div className="relative">
        <Input
          className="border border-border rounded-lg h-12 bg-background text-md pl-10 pr-14 focus-visible:outline-offset-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-0 focus-visible:ring-offset-0 "
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

        <Search className="text-muted-foreground w-[1.2rem] h-[1.2rem] absolute left-3 top-[calc(50%-0.6rem)]" />
        <div
          className="flex items-center justify-center absolute right-2 top-[calc(50%-1.0rem)] gap-2 rounded-full bg-foreground text-background w-[2.0rem] h-[2.0rem] cursor-pointer"
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
          <Plus className="w-5 h-5" />
        </div>
      </div>
    </>
  );
}
