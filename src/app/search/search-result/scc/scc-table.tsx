import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { NodeName } from "@/lib/wordchain/graph/graph";
import { MoveRight } from "lucide-react";
import SccCard from "./scc-card";

export default function SccTable({
  data,
}: {
  data: {
    nodes: NodeName[];
    succ: {
      nodes: NodeName[];
      by: string[];
    }[];
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>요소</TableHead>
          <TableHead>다음 요소</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ nodes, succ }) => (
          <TableRow key={nodes[0]}>
            <TableCell className="pl-0">
              <SccCard nodes={nodes} />
            </TableCell>
            <TableCell className="pr-0">
              <div className="flex flex-col items-start gap-2">
                {succ.map(({ nodes, by }) => (
                  <div className="flex items-center gap-2" key={nodes[0]}>
                    <div className="flex flex-wrap gap-1">
                      {by.map((word, i) => (
                        <div key={word}>
                          {word}
                          {i !== by.length - 1 && ","}
                        </div>
                      ))}
                    </div>
                    <MoveRight className="stroke-muted-foreground size-3 shrink-0" />
                    <SccCard nodes={nodes} />
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
