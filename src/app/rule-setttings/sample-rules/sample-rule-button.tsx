import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWcStore } from "@/stores/wc-store";
import type { RuleForm } from "@/types/rule";
import { ArrowUpRight } from "lucide-react";

export default function SampleRuleButton({ data }: { data: RuleForm }) {
  const setRule = useWcStore((e) => e.setRule);
  return (
    <Button
      onClick={() => {
        setRule(data);
      }}
      variant="ghost"
      className="hover:bg-card dark:hover:bg-muted flex h-auto w-full cursor-pointer rounded-xl p-0 text-left font-normal whitespace-normal hover:shadow-md"
    >
      <Card className="dark:bg-muted/50 relative w-full border bg-transparent transition-shadow dark:border-none">
        <CardHeader>
          <CardTitle className="text-base">{data.metadata!.title}</CardTitle>
          <CardDescription>{data.metadata!.description}</CardDescription>
        </CardHeader>
        <ArrowUpRight className="stroke-muted-foreground absolute top-5 right-5 stroke-2" />
      </Card>
    </Button>
  );
}
