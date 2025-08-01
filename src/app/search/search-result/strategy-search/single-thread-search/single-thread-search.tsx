import { Button } from "@/components/ui/button";
import type { NodeName } from "@/lib/wordchain/graph/graph";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { FileSpreadsheet } from "lucide-react";
import { useEffect } from "react";
import MaxThreadNumSelect from "./max-thread-num-select";
import MoveSection from "./move-section";

import { PaginationSimple } from "@/components/ui/pagination-simple"; // ✅ 추가
import { useState } from "react";

const PAGE_SIZE = 20;

export default function SingleThreadSearch({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const searchInputValue = useWcStore((e) => e.searchInputValue);

  const initSingleThreadSearch = useWcStore((e) => e.initSingleThreadSearch);
  const clearSingleThreadSearch = useWcStore((e) => e.clearSingleThreadSearch);
  const precRule = useWcStore((e) => e.precedenceRule);
  const precMap = useWcStore((e) => e.precedenceMaps);
  const moves: [NodeName, NodeName][] = useWcStore(
    (e) => e.singleThreadSearchInfo.moves,
  );

  const [page, setPage] = useState(1); // ✅ 페이지 상태 추가

  useEffect(() => {
    clearSingleThreadSearch();
    initSingleThreadSearch();
    return clearSingleThreadSearch;
  }, [
    clearSingleThreadSearch,
    initSingleThreadSearch,
    view,
    searchInputValue,
    solver,
    precRule,
    precMap,
  ]);

  // ✅ moves 변경 시 페이지 초기화
  useEffect(() => {
    setPage(1);
  }, [moves]);

  const totalPages = Math.ceil(moves.length / PAGE_SIZE);
  const paginatedMoves = moves.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE); // ✅ 페이지네이션 적용

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <MaxThreadNumSelect />
        <Button
          onClick={() =>
            document.getElementById("precedence-dialog-trigger")?.click()
          }
          variant="ghost"
          className="text-muted-foreground"
        >
          <FileSpreadsheet />
          우선순위 편집
        </Button>
      </div>
      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      {paginatedMoves.map((move) => (
        <MoveSection key={`${move[0]}${move[1]}`} solver={solver} move={move} />
      ))}

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
