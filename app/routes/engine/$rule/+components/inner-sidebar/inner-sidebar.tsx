import { cn } from "~/lib/utils";

export default function InnerSidebar({
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "h-full min-h-0 overflow-auto no-scrollbar w-[calc(max(400px,min(33svw,600px)))]",
      )}
      {...props}
    />
  );
}
