import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

type PaginationSimpleProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
};

export function PaginationSimple({
  page,
  totalPages,
  onPageChange,
  className,
  disabled = false,
}: PaginationSimpleProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={cn(
        `flex w-full items-center justify-between gap-2`,
        className,
      )}
    >
      <span className="text-muted-foreground ml-2 text-sm">
        {page} / {totalPages} 페이지
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          onClick={() => onPageChange(page - 1)}
          variant="secondary"
          disabled={page <= 1 || disabled}
          className="size-8 rounded-md"
        >
          <ArrowLeft className="stroke-foreground" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || disabled}
          className="size-8 rounded-md"
        >
          <ArrowRight className="stroke-foreground" />
        </Button>
      </div>
    </div>
  );
}
