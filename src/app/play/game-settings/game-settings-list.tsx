import { Card } from "@/components/ui/card";

export default function GameSettingsList({
  children,
}: React.ComponentProps<"div">) {
  return (
    <Card className="w-full gap-8 rounded-xl border bg-transparent px-4 py-6">
      {children}
    </Card>
  );
}
