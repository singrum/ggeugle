import { debounce, type DebouncedFunc } from "lodash-es";
import { Minus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, type ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Kbd } from "~/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { useWcStore } from "~/stores/wc-store-provider";
export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const localSearchInputValue = useWcStore((e) => e.localSearchInputValue);
  const setSearchInputValue = useWcStore((e) => e.setSearchInputValue);

  const debouncedSetValue = useMemo(
    () =>
      debounce((v: string) => {
        setSearchInputValue(v);
      }, 100),
    [setSearchInputValue],
  );

  // ------------------ 단축키 이벤트 리스너 추가 ------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 사용자가 이미 다른 입력창에 입력 중인 경우 동작 방지
      const activeElement = document.activeElement;
      const isInputText =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        (activeElement as HTMLElement)?.isContentEditable;

      if (isInputText) return;

      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // -------------------------------------------------------------

  return (
    <div
      className="flex cursor-text flex-col gap-2 rounded-b-2xl p-3"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="relative w-full">
        <SearchInputComponent
          debouncedSetValue={debouncedSetValue}
          ref={inputRef}
        />
        <Search className="text-foreground absolute top-1/2 left-1 size-5 -translate-y-1/2 stroke-3" />

        <InputActionGroup>
          {localSearchInputValue.length > 0 ? (
            <>
              <ClearButton onClick={() => debouncedSetValue.cancel()} />
              <ExceptButton onClick={() => debouncedSetValue.cancel()} />
            </>
          ) : (
            <Kbd className="bg-foreground/5 hidden lg:inline-flex">/</Kbd>
          )}
        </InputActionGroup>
      </div>
      {/* <SearchHistory /> */}
    </div>
  );
}

function SearchInputComponent({
  debouncedSetValue,
  ...props
}: {
  debouncedSetValue: DebouncedFunc<(v: string) => void>;
} & ComponentProps<"input">) {
  const addExceptedWords = useWcStore((e) => e.addExceptedWords);

  const localSearchInputValue = useWcStore((e) => e.localSearchInputValue);
  const search = useWcStore((e) => e.search);
  const setLocalSearchInputValue = useWcStore(
    (e) => e.setLocalSearchInputValue,
  );

  return (
    <Input
      {...props}
      value={localSearchInputValue}
      onChange={(e) => {
        e.preventDefault();
        let value = e.target.value;
        if (value.length >= 1 && value.at(-1) === " ") {
          if (value.length === 2) {
            value = value.slice(0, -1);
          } else {
            const values = value.split(/\s+/);
            addExceptedWords(values);
            value = "";
            search("");
            debouncedSetValue.cancel();
            return;
          }
        }
        setLocalSearchInputValue(value);
        debouncedSetValue(value);
      }}
      id="search-input"
      placeholder="음절 / 단어 / 기보를 입력하세요."
      tabIndex={1}
      className={cn(
        "w-full resize-none border-none bg-transparent pr-0 pl-9 text-lg font-medium tracking-wide shadow-none md:text-lg dark:bg-transparent",
        "focus-visible:ring-0 focus-visible:outline-none",
        { "pr-16": localSearchInputValue.length > 0 },
      )}
    />
  );
}

function ExceptButton({ onClick }: React.ComponentProps<"button">) {
  const localSearchInputValue = useWcStore((e) => e.localSearchInputValue);
  const addExceptedWords = useWcStore((e) => e.addExceptedWords);
  const search = useWcStore((e) => e.search);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();

            if (localSearchInputValue.length >= 1) {
              const values = localSearchInputValue.split(/\s+/);
              addExceptedWords(values);
              search("");
              if (onClick) {
                onClick(e);
              }
            }
          }}
          size="icon"
          className="text-foreground hover:bg-foreground/10 dark:hover:bg-foreground/10 bg-foreground/5 size-8 rounded-full"
          variant={"secondary"}
        >
          <Minus className="stroke-muted-foreground stroke-3" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>제외하기</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ClearButton({ onClick }: React.ComponentProps<"button">) {
  const search = useWcStore((e) => e.search);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            search("");
            if (onClick) {
              onClick(e);
            }
          }}
          size="icon"
          className="hover:bg-foreground/5 dark:hover:bg-foreground/5 size-8 rounded-full"
          variant={"ghost"}
        >
          <X className="stroke-muted-foreground stroke-3" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>입력 초기화</p>
      </TooltipContent>
    </Tooltip>
  );
}
function InputActionGroup({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className="absolute top-1/2 right-0 flex -translate-y-1/2 gap-1"
      {...props}
    />
  );
}
