import { ArticleIcon } from "@phosphor-icons/react";
import { Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Link, useRevalidator } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { toast } from "sonner";
import { colorMap } from "~/constants/color";
import { storage } from "~/lib/storage/storage";
import { cn } from "~/lib/utils";
import { useRulesViewStore } from "./rules-view-provider";

export default function RuleViewButton({
  rule: {
    id,
    metadata: { title, color },
  },
}: {
  rule: { id: string; metadata: { title: string; color: string } };
}) {
  const selectedRuleId = useRulesViewStore((e) => e.selectedRuleId);
  const select = useRulesViewStore((e) => e.select);
  const isSample = useRulesViewStore((e) => e.isSample);
  const { revalidate } = useRevalidator();
  return (
    <Button
      key={id}
      variant={"secondary"}
      size="lg"
      className={cn(
        "group relative flex flex-col justify-start items-start h-auto p-0 rounded-lg",
        selectedRuleId === id && "ring-2 ring-primary",
      )}
      asChild
    >
      <div className="relative w-full h-full">
        <Link
          to={`/engine/${encodeURIComponent(id)}`}
          className="flex items-center gap-2 w-full h-full py-4 px-3 pr-9 "
        >
          <ArticleIcon
            className="size-5 shrink-0"
            weight="fill"
            style={{ color: colorMap[color] }}
          />
          <span className="truncate flex-1 font-medium text-sm">{title}</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity duration-200 z-10 hover:bg-foreground/5 rounded-full",
              )}
              role="button"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={(e) => {
                select(id);
              }}
            >
              <Pencil className="size-4" />
              편집
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                try {
                  await storage.copyRuleForm(id);
                  revalidate();
                  if (isSample) {
                    toast.success("보관함에 저장되었습니다.");
                  }
                } catch (error) {
                  if (error instanceof Error) {
                    toast.error(error.message);
                  }
                  toast.error("보관함에 저장하는 중 오류가 발생했습니다.");
                }
              }}
            >
              <Copy className="size-4" />
              {isSample ? "보관함에 저장" : "복사"}
            </DropdownMenuItem>

            {!isSample && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={async () => {
                    try {
                      await storage.deleteRuleForm(id);
                      revalidate();
                    } catch (error) {
                      if (error instanceof Error) {
                        toast.error(error.message);
                      }
                      toast.error("삭제하는 중 오류가 발생했습니다.");
                    }
                  }}
                  variant="destructive"
                >
                  <Trash2 className="size-4" />
                  삭제
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Button>
  );
}
