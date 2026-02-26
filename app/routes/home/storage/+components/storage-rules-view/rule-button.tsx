import { ArticleIcon } from "@phosphor-icons/react";
import { Copy, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useRevalidator } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { storage } from "~/lib/storage/storage";
import { cn } from "~/lib/utils";
import { useStorageStore } from "./storage-provider";

export default function RuleButton({
  rule: { title, id, color },
}: {
  rule: { title: string; id: string; color: string };
}) {
  const navigate = useNavigate();
  const selectedRuleId = useStorageStore((e) => e.selectedRuleId);
  const select = useStorageStore((e) => e.select);
  const { revalidate } = useRevalidator();
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

                revalidate();
              }}
            >
              <Copy className="size-4" />
              복사
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                await storage.deleteRuleForm(id);
                revalidate();
              }}
            >
              <Trash2 className="size-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Button>
  );
}
