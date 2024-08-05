import { Input } from "@/components/ui/input";
import { useWC } from "@/lib/store/useWC";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchInput() {
  const value = useWC((e) => e.value);
  const setValue = useWC((e) => e.setValue);
  const setSearchInputValue = useWC((e) => e.setSearchInputValue);
  const exceptWords = useWC((e) => e.exceptWords);
  const setExceptWords = useWC((e) => e.setExceptWords);
  const engine = useWC((e) => e.engine);
  const searchInputValue = useWC((e) => e.searchInputValue);
  const debounced = useDebouncedCallback((value) => {
    if (engine) {
      setSearchInputValue(value);
    }
  }, 300);
  useEffect(() => {
    debounced.cancel();
  }, [searchInputValue]);
  return (
    <div className="flex flex-col gap-2 relative">
      <Input
        className="rounded-full bg-muted text-md pl-10 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-background focus-visible:border-primary"
        value={value}
        type="search"
        placeholder="글자 또는 단어를 입력하세요."
        onChange={(e) => {
          e.preventDefault();
          if (e.target.value[e.target.value.length - 1] === " ") {
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
          } else {
            debounced(e.target.value);
            setValue(e.target.value);
          }
        }}
      />
      <Search className="text-foreground w-[1.2rem] h-[1.2rem] absolute left-3 top-[calc(50%-0.6rem)]" />
    </div>
  );
}
