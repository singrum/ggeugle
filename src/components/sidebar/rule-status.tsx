import { useWcStore } from "@/stores/wc-store";
import { Button } from "../ui/button";

export default function RuleStatus() {
  const rule = useWcStore((e) => e.rule);
  return (
    <Button size="sm" variant="outline" className="h-7 flex-1">
      <span className="text-muted-foreground font-normal">
        {rule.metadata?.title}
      </span>
    </Button>
  );
}
