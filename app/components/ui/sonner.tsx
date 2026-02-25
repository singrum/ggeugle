import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!rounded-lg",
          actionButton:
            "!bg-secondary !text-secondary-foreground !hover:bg-secondary/80 !rounded-lg !text-medium !h-8 !px-4",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
