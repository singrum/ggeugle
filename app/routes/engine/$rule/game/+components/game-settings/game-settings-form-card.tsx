export function GameSettingsCard({ children }: React.ComponentProps<"div">) {
  return (
    <div className="flex min-h-9 w-full items-center justify-between gap-4 px-2 py-0">
      {children}
    </div>
  );
}
export function GameSettingsHead({ children }: React.ComponentProps<"div">) {
  return <h2 className="text-sm font-medium">{children}</h2>;
}

export function GameSettingsContent({ children }: React.ComponentProps<"div">) {
  return <div>{children}</div>;
}
