import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { Plus, X } from "lucide-react";
import { ActionButton, SplitButtons, TextButton } from "../split-buttons";
import { Button } from "../ui/button";

export function WordButton({
  children,
  variant,
}: React.ComponentProps<"button"> & {
  variant: "win" | "lose" | "route" | "removed";
}) {
  const search = useWcStore((e) => e.search);
  const addExceptedWord = useWcStore((e) => e.addExceptedWord);
  const solver = useWcStore((e) => e.solver);
  const autoSearch = useWcStore((e) => e.autoSearch);
  const wrapperColorVariant = {
    win: "bg-win/10",
    lose: "bg-lose/10",
    route: "bg-route/10",
    removed: "bg-muted dark:bg-muted/50",
  };
  const buttonColorVariant = {
    win: "text-win hover:text-win hover:bg-win/20 dark:hover:bg-win/20",
    lose: "text-lose hover:text-lose hover:bg-lose/20 dark:hover:bg-lose/20",
    route:
      "text-route hover:text-route hover:bg-route/20 dark:hover:bg-route/20",
    removed:
      "text-muted-foreground hover:text-foreground hover:bg-muted/80 dark:hover:bg-muted/80",
  };
  return (
    <SplitButtons>
      <TextButton
        variant={"ghost"}
        className={cn(
          "pr-3",
          wrapperColorVariant[variant],
          buttonColorVariant[variant],
        )}
        onClick={() => search((children as string).at(solver!.tailIdx)!)}
      >
        {children}
      </TextButton>
      <ActionButton
        variant={"ghost"}
        className={cn(
          "group/wordbutton w-8",
          wrapperColorVariant[variant],
          buttonColorVariant[variant],
        )}
        onClick={() => {
          if (autoSearch) {
            search((children as string).at(solver!.tailIdx)!);
          }
          addExceptedWord(children as string);
        }}
      >
        <X className="stroke-muted-foreground group-hover/wordbutton:stroke-foreground mr-1 size-3.5 stroke-3 transition-colors" />
      </ActionButton>
    </SplitButtons>
  );
}
export function ExceptedWordButton({
  children,
}: React.ComponentProps<"button"> & {}) {
  const search = useWcStore((e) => e.search);
  const removeExceptedWord = useWcStore((e) => e.removeExceptedWord);

  return (
    <div className="group/wordbutton text-muted-foreground bg-secondary flex w-fit max-w-full cursor-default items-center gap-0 rounded-xl shadow-sm transition-colors">
      <div className="z-1 h-auto flex-1 rounded-l-full text-left text-sm font-medium tracking-wider break-all whitespace-normal">
        {(children as string).split("").map((e, i) => (
          <Button
            className={cn("h-fit p-0 py-1", {
              "pl-3": i === 0,
              "pr-2": i === (children as string).length - 1,
            })}
            onClick={() => search(e)}
            variant="ghost"
          >
            {e}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="group/wordbuttonplus z-0 -ml-2 size-8 rounded-full"
        onClick={() => {
          removeExceptedWord(children as string);
        }}
      >
        <Plus className="stroke-muted-foreground group-hover/wordbuttonplus:stroke-foreground size-4 stroke-2 transition-colors" />
      </Button>
    </div>
  );
}
