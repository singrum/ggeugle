import { PaginationSimple } from "@/components/ui/pagination-simple"; // ✅ 페이지네이션 컴포넌트
import type { NodeType } from "@/lib/wordchain/graph/graph";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import type { MoveType } from "@/types/search";
import { useEffect, useMemo, useState } from "react";
import CharInfoTable from "./char-info-table";
import DirectionSettings from "./direction-settings";
import DisplayTypeSettings from "./display-type-settings";
import TypeSettings from "./type-settings";

const PAGE_SIZE = 20;

export default function CharInfo({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);

  const [type, setType] = useState<NodeType>("win");
  const [direction, setDirection] = useState<0 | 1>(0);
  const [sort, setSort] = useState<{ key: "total" | MoveType; desc: boolean }>({
    key: "total",
    desc: true,
  });
  const [displayType, setDisplayType] = useState<"number" | "fraction">(
    "number",
  );
  const [page, setPage] = useState(1); // ✅ 페이지 상태

  const fullData = useMemo(
    () =>
      solver.graphSolver.getCharInfo(type, view, direction, sort, displayType),
    [solver, view, type, direction, sort, displayType],
  );
  const moveTypes = useMemo(
    () =>
      ([0, 1, 2, 3, 4, 5] as MoveType[]).filter((type) =>
        fullData.some((e) => e.num[type] > 0),
      ),
    [fullData],
  );

  const totalPages = Math.ceil(fullData.length / PAGE_SIZE);
  const data = fullData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE); // ✅ 페이징된 데이터

  // 페이지가 바뀌거나 정렬이 바뀔 때, 페이지 초기화
  useEffect(() => {
    setPage(1);
  }, [solver, view, type, direction, sort, displayType]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypeSettings type={type} setType={setType} setSort={setSort} />
          <DirectionSettings
            direction={direction}
            setDirection={setDirection}
            setSort={setSort}
          />
        </div>
        <DisplayTypeSettings
          displayType={displayType}
          setDisplayType={setDisplayType}
        />
      </div>
      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      <CharInfoTable
        moveTypes={moveTypes}
        type={type}
        data={data}
        sort={sort}
        setSort={setSort}
        displayType={displayType}
      />
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
