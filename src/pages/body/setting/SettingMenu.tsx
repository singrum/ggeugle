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
    <div className={cn("flex flex-col gap-4 py-4 bg-background", className)}>
      <div className="text-base font-semibold">{name}</div>

      {children}
    </div>
  );
}
