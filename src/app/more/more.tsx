import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Description from "./description";
import Features from "./features";
import NewFeatures from "./new-feature";
import Portals from "./portals";
import Title from "./title";

export default function More() {
  const isMobile = useIsMobile();
  return (
    <div className="flex h-[calc(100dvh-4rem)] items-center justify-center overflow-auto lg:h-dvh break-keep">
      <div className="mx-auto my-auto max-w-xl space-y-8 p-6">
        <div className="flex justify-between">
          <Title />
        </div>
        <Description />
        <div
          className={cn("flex justify-between", {
            "flex-col gap-8": isMobile,
          })}
        >
          <Features />
          <NewFeatures />
        </div>
        <Separator />
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center sm:gap-0">
          <Portals />
        </div>
      </div>
    </div>
  );
}
