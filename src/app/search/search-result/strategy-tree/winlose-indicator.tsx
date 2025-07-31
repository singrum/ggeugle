import { cn } from "@/lib/utils";

export default function WinloseIndicator({ isWin }: { isWin: boolean }) {
  return (
    <div
      className={cn(
        "border-background outline-background bg-background absolute top-[1.125rem] left-[calc(-1rem-1px)] flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full md:left-[calc(-1.5rem-1px)]",
      )}
    >
      <div
        className={cn("size-2 rounded-full", "bg-lose", {
          "bg-win": isWin,
        })}
      />
    </div>
  );
}
