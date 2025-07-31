import { Ball } from "@/components/ball";
import CharButton from "@/components/char-data-section/char-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  moveTypeNameMap,
  moveTypeToWordVariant,
} from "@/lib/wordchain/constants";
import type { NodeType } from "@/lib/wordchain/graph/graph";
import type { MoveType } from "@/types/search";
import { sum } from "lodash";
import { MoveDown, MoveUp } from "lucide-react";

export default function CharInfoTable({
  data,
  type,
  sort,
  setSort,
  displayType,
  moveTypes,
}: {
  data: {
    char: string;
    num: [number, number, number, number, number, number];
  }[];
  type: NodeType;
  sort: { key: "total" | MoveType; desc: boolean };
  setSort: (sort: { key: "total" | MoveType; desc: boolean }) => void;
  displayType: "number" | "fraction";
  moveTypes: MoveType[];
}) {
  const formatValue = (value: number) => {
    return displayType === "fraction"
      ? `${(value * 100).toFixed(1)}%`
      : value.toLocaleString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-0 text-center">음절</TableHead>
          {moveTypes.map((e) => (
            <TableHead className="px-0 text-center" key={`head-${e}`}>
              <Button
                size="sm"
                variant={"ghost"}
                onClick={() => {
                  setSort({ key: e, desc: sort.key === e ? !sort.desc : true });
                }}
              >
                <Ball variant={moveTypeToWordVariant[e]} />
                {moveTypeNameMap[e].slice(0, 3)}
                {sort.key === e &&
                  (sort.desc ? (
                    <MoveDown className="size-3" />
                  ) : (
                    <MoveUp className="size-3" />
                  ))}
              </Button>
            </TableHead>
          ))}
          <TableHead className="px-0 text-center">
            <Button
              variant={"ghost"}
              onClick={() => {
                setSort({
                  key: "total",
                  desc: sort.key === "total" ? !sort.desc : true,
                });
              }}
            >
              총합
              {sort.key === "total" &&
                (sort.desc ? (
                  <MoveDown className="size-3" />
                ) : (
                  <MoveUp className="size-3" />
                ))}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ char, num }) => (
          <TableRow key={char}>
            <TableCell className="text-center">
              <CharButton variant={type} className="font-medium">
                {char}
              </CharButton>
            </TableCell>
            {moveTypes.map((key) => (
              <TableCell className="text-center" key={`cell-${char}-${key}`}>
                {formatValue(num[key])}
              </TableCell>
            ))}
            <TableCell className="text-center">
              {formatValue(sum(num))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
