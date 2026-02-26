import { ArticleIcon } from "@phosphor-icons/react/dist/ssr";
import { Download, MoreVertical, Pencil } from "lucide-react";
import { Link } from "react-router";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
export default function RulesViewContent({
  rules,
  selectedRuleId,
  setSelectedRuleId,
}: {
  rules: { id: string; title: string; color: string; updatedAt: number }[];
  selectedRuleId: string | null;
  setSelectedRuleId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
      {rules.map(({ title, id, color }) => (
        <Button
          key={id}
          variant={"secondary"}
          size="lg"
          className={cn(
            "group relative flex flex-col justify-start items-start h-auto p-0 rounded-lg overflow-hidden",
            {
              "border-ring ring-ring ring-[3px]": selectedRuleId === id,
            },
          )} // p-0으로 변경
          asChild
        >
          <div className="relative w-full h-full">
            <Link
              to={`/engine/${encodeURIComponent(id)}`}
              className="flex items-center gap-2 w-full h-full py-4 px-3"
            >
              <ArticleIcon
                className="size-5 shrink-0"
                weight="fill"
                style={{ color: color }}
              />
              <span className="truncate flex-1 font-medium text-sm">
                {title}
              </span>

              <div className="w-12 h-4" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity duration-200 z-10",
                    buttonVariants({ variant: "ghost", size: "icon" }),
                  )}
                  role="button"
                >
                  <MoreVertical />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={(e) => {
                    setSelectedRuleId((prev) => (prev === id ? null : id));
                  }}
                >
                  <Pencil className="size-4" />
                  편집
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => {}}>
                  <Download className="size-4" />
                  보관함에 저장
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Button>
      ))}
    </div>
  );
}
