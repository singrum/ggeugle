import { cn } from "@/lib/utils";

export function SettnigMenu({
  name,
  className,
  children,
}: {
  name: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 md:p-0 bg-background dark:bg-muted/40 md:dark:bg-background",
        className
      )}
    >
      <div className="text-base font-semibold">{name}</div>

      {children}
    </div>
  );
}
