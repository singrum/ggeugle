import { ChevronRight } from "lucide-react";

import { ScrollIcon } from "@phosphor-icons/react";
import { Fragment } from "react/jsx-runtime";
import { cn } from "~/lib/utils";
import { Button } from "../../../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../../components/ui/tooltip";

export function RuleButton({ ruleTitle }: { ruleTitle?: string }) {
  // const rule = useWcStore((e) => e.rule);
  // const originalSolver = useWcStore((e) => e.originalSolver);
  // const navigate = useNavigate();
  // const location = useLocation();
  return (
    <div className="flex min-w-0 flex-1 items-center text-nowrap">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "max-w-full cursor-pointer px-2 pr-4 has-[>svg]:pl-3",
              { "animate-pulse": !ruleTitle },
            )}
            variant={"outline"}
          >
            <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-auto">
              <ScrollIcon weight="fill" className="size-5" />
              {ruleTitle
                ? ruleTitle.split("-").map((e, i, arr) => (
                    <Fragment key={i}>
                      {e}
                      {arr.length - 1 !== i && (
                        <ChevronRight className="size-3" />
                      )}
                    </Fragment>
                  ))
                : "커스텀 룰"}
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>룰 변경</TooltipContent>
      </Tooltip>
    </div>
  );
}
