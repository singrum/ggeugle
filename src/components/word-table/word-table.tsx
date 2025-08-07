import { pageSizeInfo } from "@/constants/search";
import { useWcStore } from "@/stores/wc-store";
import type { MoveRow } from "@/types/search";
import { useState } from "react";
import { PaginationSimple } from "../ui/pagination-simple";
import WordRow from "./word-row";

export default function WordsTable({ rows }: { rows: MoveRow[] }) {
  const [page, setPage] = useState(1);
  const pageSize = useWcStore((e) => e.pageSize);
  const totalPages = Math.ceil(rows.length / pageSizeInfo[pageSize].value);
  const start = (page - 1) * pageSizeInfo[pageSize].value;
  const currentRows = rows.slice(start, start + pageSizeInfo[pageSize].value);

  return (
    <div className="flex flex-col gap-4">
      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      <div className="flex flex-col gap-0.5">
        {currentRows.map((row, i) => (
          <WordRow data={row} key={i} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
