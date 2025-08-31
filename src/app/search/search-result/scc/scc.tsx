import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationSimple } from "@/components/ui/pagination-simple"; // ✅ 추가
import { pageSizeInfo } from "@/constants/search";
import type { NodeName } from "@/lib/wordchain/graph/graph";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { ChevronDown, MoveDown, MoveUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SccTable from "./scc-table";

const topoSortInfo = [
  { title: "오름차순", icon: MoveUp },
  { title: "내림차순", icon: MoveDown },
];

export default function Scc({ solver }: { solver: WordSolver }) {
  const view = useWcStore((e) => e.view);
  const pageSize = useWcStore((e) => e.pageSize);

  const [asc, setAsc] = useState<0 | 1>(0);
  const [page, setPage] = useState(1); // ✅ 페이지 상태 추가

  const fullData: {
    nodes: NodeName[];
    succ: { nodes: NodeName[]; by: string[] }[];
  }[] = useMemo(() => solver.getSccData(view, !asc), [solver, view, asc]);

  const totalPages = Math.ceil(fullData.length / pageSizeInfo[pageSize].value);
  const data = fullData.slice(
    (page - 1) * pageSizeInfo[pageSize].value,
    page * pageSizeInfo[pageSize].value,
  ); // ✅ 현재 페이지에 맞는 데이터 추출

  const info = topoSortInfo[Number(asc)];

  // 정렬 기준 바뀌면 페이지 초기화
  useEffect(() => {
    setPage(1);
  }, [asc, view]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="gap-4">
              <div>
                위상 정렬: <span className="font-normal">{info.title}</span>
              </div>
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-50">
            <DropdownMenuRadioGroup
              value={`${asc}`}
              onValueChange={(e: string) => setAsc(Number(e) as 0 | 1)}
            >
              {topoSortInfo.map(({ title }, i) => (
                <DropdownMenuRadioItem value={`${i}`} key={i}>
                  {title}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      <SccTable data={data} />

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
