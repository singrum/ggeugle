import type React from "react";
import { Separator } from "../ui/separator";

export default function WordsSection({
  children,
}: React.ComponentProps<"div">) {
  return (
    <>
      <section className="flex flex-col items-center gap-6">{children}</section>
      <Separator className="mx-auto my-6" />
    </>
  );
}
