export default function InnerSidebar({
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className="w-1/3 h-full min-h-0 overflow-auto no-scrollbar w-[calc(max(400px,min(33svw,600px)))]"
      {...props}
    />
  );
}
