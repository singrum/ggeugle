import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { MoveRight, Plus, X } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import CharButton from "../char-data-section/char-button";
import { ActionButton, SplitButtons, TextButton } from "../split-buttons";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
  const solver = useWcStore((e) => e.solver);
  const head = (children as string).at(solver!.headIdx)!;
  const tail = (children as string).at(solver!.tailIdx)!;
  return (
    <div className="group/wordbutton text-muted-foreground bg-secondary flex w-fit max-w-full cursor-default items-center gap-0 rounded-xl shadow-sm transition-colors">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            onClick={() => search((children as string).at(solver!.tailIdx)!)}
            variant="ghost"
            className="hover/wordbutton:text-foreground h-auto flex-1 rounded-l-full py-1 pr-2 pl-3 text-left break-all whitespace-normal"
          >
            {children}
          </Button>
        </TooltipTrigger>

        <TooltipContent
          className="bg-popover flex w-fit items-center rounded-lg border-none p-2"
          arrowClassName="bg-popover fill-popover"
        >
          {[head, tail].map((e, i) => (
            <Fragment key={i}>
              <CharButton variant={"default"} className="text-sm font-medium">
                {e}
              </CharButton>
              {i === 0 && (
                <MoveRight className="stroke-muted-foreground z-10 -mx-1.5 size-3" />
              )}
            </Fragment>
          ))}
        </TooltipContent>
      </Tooltip>

      <Button
        variant="ghost"
        size="icon"
        className="group/wordbuttonplus -ml-2 size-8 rounded-full"
        onClick={() => {
          removeExceptedWord(children as string);
        }}
      >
        <Plus className="stroke-muted-foreground group-hover/wordbuttonplus:stroke-foreground size-4 stroke-2 transition-colors" />
      </Button>
    </div>
  );
}
