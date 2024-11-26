import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

export default function WordsTrail({
  words,
  size,
  colored,
}: {
  words: string[];
  size?: "sm" | "md";
  colored?: boolean;
}) {
  return (
    <div
      className={cn("flex flex-wrap gap-y-1.5 gap-x-0.5 items-center", {
        "text-xs": size === "sm" || !size,
        "text-base font-medium": size === "md",
      })}
    >
      {words.map((e, i) => (
        <Fragment key={i}>
          <div
            className={cn("flex items-center", {
              "text-win": colored && (words.length - i) % 2 === 1,
              "text-los": colored && (words.length - i) % 2 === 0,
            })}
          >
            {e}
          </div>
          {i !== words!.length - 1 && (
            <ChevronRight
              className={cn("text-muted-foreground", {
                "w-3 h-3": size === "sm" || !size,
                "w-4 h-4": size === "md",
              })}
              strokeWidth={size === "md" ? 2 : 1}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
