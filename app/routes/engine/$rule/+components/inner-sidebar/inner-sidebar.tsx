import { cn } from "~/lib/utils";

export default function InnerSidebar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "h-full min-h-0 w-[calc(max(400px,min(33svw,600px)))] shrink-0",
        className,
      )}
      {...props}
    />
  );
}
