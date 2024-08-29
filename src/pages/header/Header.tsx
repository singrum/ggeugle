import { useMenu } from "@/lib/store/useMenu";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export default function Header({ className }: { className?: string }) {
  const menu = useMenu((e) => e.menu);
  return (
    <div
      className={cn(
        "top-0 flex flex-col min-h-9 z-10 sticky bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 px-1",
        className,
        {
          "bg-muted/40 supports-[backdrop-filter]:bg-muted-40":
            menu.index === 1 || menu.index === 2 || menu.index === 4,
        }
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