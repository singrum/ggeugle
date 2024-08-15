export function SettnigMenu({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg font-semibold">{name}</div>

      {children}
    </div>
  );
}
