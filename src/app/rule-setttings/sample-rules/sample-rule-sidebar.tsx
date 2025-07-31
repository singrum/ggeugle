import { cn } from "@/lib/utils";
import Header from "./header";
import SampleRuleList from "./sample-rule-list";

export default function SampleRuleSidebar({
  className,
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      <Header />
      <SampleRuleList />
    </div>
  );
}
