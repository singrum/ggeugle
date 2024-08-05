import { ChevronRight } from "lucide-react";

export function SettnigMenu({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold">{name}</div>

      {children}
    </div>
  );
}
