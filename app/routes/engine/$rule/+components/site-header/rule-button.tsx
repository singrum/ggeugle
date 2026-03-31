import { Loader2, Pencil } from "lucide-react";
import { colorMap } from "~/constants/color";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";
import { useWcStore } from "~/stores/wc-store-provider";
import { Button } from "../../../../../components/ui/button";

import { CircleIcon } from "@phosphor-icons/react";
import type { LoaderData } from "~/types/rule";
import RuleEditSheetTrigger from "../rule-edit/rule-edit-sheet-trigger";

export function RuleButton({ loaderData }: { loaderData: LoaderData }) {
  const { title: ruleTitle, id: ruleId, color } = loaderData;
  const isMobile = useIsMobile();
  const loading = useWcStore((e) => !e.solver);
  return (
    <div className="flex min-w-0 flex-1 items-center text-nowrap">
      <RuleEditSheetTrigger ruleId={ruleId} asChild>
        <Button
          className={cn("max-w-full", {
            "opacity-50": loading,
          })}
          variant={"outline"}
          size={"default"}
        >
          <div className="flex items-center justify-center size-4">
            <CircleIcon
              className="size-3 shrink-0"
              weight="fill"
              style={{ color: colorMap[color] }}
            />
          </div>

          <div className="no-scrollbar flex flex-1 items-center gap-3 overflow-auto">
            <div>{ruleTitle}</div>
          </div>
          {loading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Pencil className="size-3 stroke-foreground" />
          )}
        </Button>
      </RuleEditSheetTrigger>
    </div>
  );
}
