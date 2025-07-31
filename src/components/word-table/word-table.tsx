import type { MoveRow } from "@/types/search";
import { useState } from "react";
import { PaginationSimple } from "../ui/pagination-simple";
import WordRow from "./word-row";

const PAGE_SIZE = 20;

export default function WordsTable({ rows }: { rows: MoveRow[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(rows.length / PAGE_SIZE);

  const start = (page - 1) * PAGE_SIZE;
  const currentRows = rows.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-2">
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
