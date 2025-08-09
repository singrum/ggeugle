import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { guelMaxRouteCharData } from "@/constants/search";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { useMemo } from "react";

export default function MaxRouteCharDataTable({
  solver,
}: {
  solver: WordSolver;
}) {
  const view = useWcStore((e) => e.view);
  const data = useMemo(
    () => solver.graphSolver.getMaxRouteInfo(view),
    [solver, view],
  );
  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>주요 루트 정보</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>현재 룰</TableHead>
              <TableHead>구엜룰</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">음절 수</TableCell>
              <TableCell>{data.charNum}</TableCell>
              <TableCell>{guelMaxRouteCharData[view].charNum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">단어 수</TableCell>
              <TableCell>{data.moveNum}</TableCell>
              <TableCell>{guelMaxRouteCharData[view].moveNum}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">평균 단어 수</TableCell>
              <TableCell>
                {typeof data.averageNum === "number" && !isNaN(data.averageNum)
                  ? data.averageNum
                  : "-"}
              </TableCell>
              <TableCell>{guelMaxRouteCharData[view].averageNum}</TableCell>
            </TableRow>
            {/* <TableRow>
              <TableCell className="font-medium">표준 편차</TableCell>
              <TableCell>{dat}</TableCell>
              <TableCell></TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
