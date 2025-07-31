import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { Search } from "lucide-react";
import type React from "react";

export default function WordButton({
  className,
  children,
  active,
  ...props
}: { active: boolean } & React.ComponentProps<"button">) {
  const search = useWcStore((e) => e.search);
  const button = (
    <Button
      variant={"ghost"}
      {...props}
      className={cn(
        "text-muted-foreground px-3 font-normal",
        { "text-foreground font-medium": active },
        className,
      )}
    >
      {children}
    </Button>
  );
  return active ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{button}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => search(children as string)}>
          <Search />
          검색
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    button
  );
}
