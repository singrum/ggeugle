import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function MobileNavButton({
  label,
  className,
  active,
  ...props
}: {
  label: string;
  active?: boolean;
} & React.ComponentProps<"button">) {
  return (
    <Button
      className={cn(
        "group/nav text-muted-foreground hover:text-muted-foreground w-full cursor-pointer flex-col justify-between gap-1 p-0 hover:bg-transparent hover:dark:bg-transparent",

        className,
      )}
      variant="ghost"
      {...props}
    >
      <div className="flex h-full flex-col justify-center gap-1">
        <div
          className={cn(
            "flex flex-1 items-center justify-center text-base font-semibold",
            {
              "text-foreground": active,
            },
          )}
        >
          {label}
        </div>
        <div
          className={cn("h-1 w-full rounded-t", { "bg-foreground": active })}
        />
      </div>
    </Button>
  );
}
