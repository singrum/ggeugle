import { ArticleIcon } from "@phosphor-icons/react";
import { Download, MoreVertical, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { storage } from "~/lib/storage/storage";
import { cn } from "~/lib/utils";
import { useRulesViewStore } from "./rules-view-provider";

export default function RuleViewButton({
  rule: { title, id, color },
}: {
  rule: { title: string; id: string; color: string };
}) {
  const navigate = useNavigate();
  const selectedRuleId = useRulesViewStore((e) => e.selectedRuleId);
  const select = useRulesViewStore((e) => e.select);
  return (
    <Button
      key={id}
      variant={"secondary"}
      size="lg"
      className={cn(
        "group relative flex flex-col justify-start items-start h-auto p-0 rounded-lg overflow-hidden",
        selectedRuleId === id && "ring-2 ring-ring",
      )} // p-0으로 변경
      asChild
    >
      <div className="relative w-full h-full">
        <Link
          to={`/engine/${encodeURIComponent(id)}`}
          className="flex items-center gap-2 w-full h-full py-4 px-3 pr-9"
        >
          <ArticleIcon
            className="size-5 shrink-0"
            weight="fill"
            style={{ color: color }}
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
                await storage.copyRuleForm(id);
                navigate("/home/storage");
              }}
            >
              <Download className="size-4" />
              보관함에 저장
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Button>
  );
}
