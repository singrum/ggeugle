import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CharCard({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <Card
      className={cn(
        "bg-muted/50 flex w-full flex-row flex-wrap gap-0 border-0 px-3 py-2",
        className,
      )}
    >
      {children}
    </Card>
  );
}
