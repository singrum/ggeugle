import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import type React from "react";
import { Button, buttonVariants } from "./ui/button";

export function SplitButtons({ children }: React.ComponentProps<"div">) {
  return <div className="flex gap-[1px]">{children}</div>;
}

export function TextButton({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <Button
      size={size}
      variant={variant}
      className={cn("h-8 rounded-l-2xl rounded-r-[0.1rem]", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export function ActionButton({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <Button
      size={size}
      variant={variant}
      className={cn("h-8 rounded-l-[0.1rem] rounded-r-2xl", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
