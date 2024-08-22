import { Input } from "@/components/ui/input";
import { useWC } from "@/lib/store/useWC";
import { CornerRightUp, Search } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
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
            }
          }}
          onChange={(e) => {
            e.preventDefault();

            debounced(e.target.value.split(" ").at(-1));
            setValue(e.target.value);
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
