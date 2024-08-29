import { useMenu } from "@/lib/store/useMenu";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export default function Header({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "top-0 flex flex-col min-h-9 z-10 sticky bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 px-1",
        className
      )}
    >
      <div className="flex w-full justify-between p-2">
        <div
          className="flex items-end gap-1"
          onClick={() => {
            location.reload();
          }}
        >
          <Logo />
          <div className="text-muted-foreground mb-1 text-xs">
            끝말잇기 검색엔진
          </div>
        </div>
      </div>
    </div>
  );
}
