import { Input } from "@/components/ui/input";
import { useCookieSettings } from "@/lib/store/useCookieSettings";
import { useWC } from "@/lib/store/useWC";
import { CornerRightUp, Search } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
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
    <div className="px-3 py-2 md:px-4 bg-background ">
      <div className="relative">
        <Input
          className="drop-shadow-md border-none rounded-lg h-12 bg-accent text-md pl-10 pr-10 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
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
        <div className="flex items-center absolute right-3 top-[calc(50%-0.6rem)] gap-2">
          <CornerRightUp
            className="text-foreground w-[1.2rem] h-[1.2rem] cursor-pointer "
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
          />
        </div>
      </div>
    </div>
  );
}
