import { useMenu } from "@/lib/store/useMenu";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export default function Header() {
  const menu = useMenu((e) => e.menu);
  return (
    <div
      className={cn(
        "top-0 flex flex-col min-h-9 z-10 sticky bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border",
        {
          "bg-muted/40": menu.index === 1 || menu.index === 2,
        }
      )}
    >
      <div className="flex w-full justify-between p-2">
        <div className="flex items-end gap-1">
          <Logo />
          <div className="text-muted-foreground mb-1 text-xs">
            끝말잇기 검색기
          </div>
        </div>
      </div>
    </div>
  );
}
