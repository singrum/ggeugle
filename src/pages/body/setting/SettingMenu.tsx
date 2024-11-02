import { cn } from "@/lib/utils";

export function SettnigMenu({
  name,
  description,
  className,
  children,
}: {
  name: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-4 py-4 bg-background", className)}>
      <div>
        <div className="text-base font-semibold">{name}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
      </div>

      {children}
    </div>
  );
}
