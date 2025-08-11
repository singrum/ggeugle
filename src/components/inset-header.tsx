import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import {
  Book,
  BookMarked,
  ChevronRight,
  ChevronsUpDown,
  MoreVertical,
  Wrench,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function InsetHeader({ children }: React.ComponentProps<"div">) {
  return (
    <div className="flex w-full items-center justify-between">{children}</div>
  );
}

export function InsetHeaderLeft() {
  const rule = useWcStore((e) => e.rule);
  const originalSolver = useWcStore((e) => e.originalSolver);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="over-flow-hidden no-scrollbar flex min-w-0 flex-1 items-center overflow-auto text-nowrap">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "cursor-pointer bg-transparent px-2 text-base font-normal has-[>svg]:px-2 dark:bg-transparent",
              {
                "animate-pulse": !originalSolver,
              },
            )}
            variant={"ghost"}
            onClick={() => navigate(`/rule${location.search}`)}
          >
            {rule.metadata?.title ? (
              <BookMarked className="stroke-foreground size-4" />
            ) : (
              <Wrench className="stroke-foreground size-4" />
            )}

            {rule.metadata?.title ? (
              <div className="flex items-center gap-1">
                {rule.metadata.title.split("-").map((e, i, arr) => (
                  <Fragment key={i}>
                    {e}
                    {arr.length - 1 !== i && (
                      <ChevronRight className="size-3" />
                    )}
                  </Fragment>
                ))}
              </div>
            ) : (
              "커스텀 룰"
            )}
            <ChevronsUpDown className="size-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>룰 변경</TooltipContent>
      </Tooltip>
    </div>
  );
}
export function ActionGroup({ children }: React.ComponentProps<"div">) {
  const isMobile = useIsMobile();
  if (isMobile) {
    <Button variant={"outline"} size="icon">
      <MoreVertical />
    </Button>;
  } else {
    return children;
  }
}
