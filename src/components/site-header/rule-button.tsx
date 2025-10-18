import { cn } from "@/lib/utils";
import { useWcStore } from "@/stores/wc-store";
import { ChevronRight, ChevronsUpDown } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function RuleButton() {
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
              "max-w-full cursor-pointer px-2 text-base has-[>svg]:pr-3 has-[>svg]:pl-3",
              { "animate-pulse": !originalSolver },
            )}
            variant={"ghost"}
            onClick={() => navigate(`/rule${location.search}`)}
          >
            <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-auto">
              {/* {rule.metadata?.title ? (
                <BookText className="stroke-foreground size-4" />
              ) : (
                <Wrench className="stroke-foreground size-4" />
              )} */}

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
            <ChevronsUpDown className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>룰 변경</TooltipContent>
      </Tooltip>
    </div>
  );
}
