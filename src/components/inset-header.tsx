import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import {
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
    <div className="flex min-w-0 flex-1 items-center text-nowrap">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "max-w-full cursor-pointer bg-transparent px-2 text-base font-normal has-[>svg]:px-2 dark:bg-transparent",
              {
                "animate-pulse": !originalSolver,
              },
            )}
            variant={"ghost"}
            onClick={() => navigate(`/rule${location.search}`)}
          >
            <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-auto">
              {rule.metadata?.title ? (
                <BookMarked className="stroke-foreground size-4" />
              ) : (
                <Wrench className="stroke-foreground size-4" />
              )}

              {rule.metadata?.title
                ? rule.metadata.title.split("-").map((e, i, arr) => (
                    <Fragment key={i}>
                      {e}
                      {arr.length - 1 !== i && (
                        <ChevronRight className="size-3" />
                      )}
                    </Fragment>
                  ))
                : "커스텀 룰"}
            </div>
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
