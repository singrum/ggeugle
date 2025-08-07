import { Ball } from "@/components/ball";
import CharButton from "@/components/char-data-section/char-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaginationSimple } from "@/components/ui/pagination-simple";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pageSizeInfo } from "@/constants/search";
import {
  moveTypeNameMap,
  moveTypeToWordVariant,
} from "@/lib/wordchain/constants";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import type { MoveType } from "@/types/search";
import { round, sum } from "lodash";
import { ChevronsUpDown, MoveDown, MoveUp } from "lucide-react";
import { useEffect } from "react";
const adjacentOptions = ["다음 단어", "이전 단어"];

export default function DistributionTable({ solver }: { solver: WordSolver }) {
  const option = useWcStore((e) => e.wordDistributionOption);
  const data = useWcStore((e) => e.distributionData);
  const moveTypes = useWcStore((e) => e.distributionRows);
  const page = useWcStore((e) => e.distributionTablePage);
  const setPage = useWcStore((e) => e.setDistributionTablePage);
  const nodeType = useWcStore((e) => e.distributionNodeType);
  const view = useWcStore((e) => e.view);
  const setData = useWcStore((e) => e.setDistributionData);
  const pageSize = useWcStore((e) => e.pageSize);

  useEffect(() => {
    setData(
      option.type === "adjacent"
        ? solver.graphSolver.getDistribution(
            nodeType,
            view,
            option.direction,
            option.sort,
            option.displayType,
          )
        : solver.graphSolver.getDistributionWithCalc(
            nodeType,
            view,
            option.wordTypes,
            option.desc,
            option.type,
          ),
    );
  }, [solver, view, nodeType, option, setData]);

  const formatValue = (value: number) => {
    return option.type === "adjacent" && option.displayType === "fraction"
      ? `${(value * 100).toFixed(1)}%`
      : value.toLocaleString();
  };
  const totalPages = Math.ceil(
    (data ? data.length : 0) / pageSizeInfo[pageSize].value,
  );
  const pagedData = data?.slice(
    (page - 1) * pageSizeInfo[pageSize].value,
    page * pageSizeInfo[pageSize].value,
  );
  return (
    <>
      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-0 text-center">음절</TableHead>
            {option.type === "adjacent" ? (
              <>
                {moveTypes.map((e) => (
                  <TableHead className="px-0 text-center" key={`head-${e}`}>
                    <Button
                      size="sm"
                      variant={"ghost"}
                      onClick={() => {
                        useWcStore.setState((state) => {
                          if (
                            state.wordDistributionOption.type === "adjacent"
                          ) {
                            state.wordDistributionOption.sort = {
                              key: e as MoveType,
                              desc:
                                option.sort.key === e
                                  ? !option.sort.desc
                                  : true,
                            };
                          }
                        });
                      }}
                    >
                      <Ball variant={moveTypeToWordVariant[e]} />
                      {moveTypeNameMap[e].slice(0, 3)}
                      {option.sort.key === e &&
                        (option.sort.desc ? (
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
                      useWcStore.setState((state) => {
                        if (state.wordDistributionOption.type === "adjacent") {
                          state.wordDistributionOption.sort = {
                            key: "total",
                            desc:
                              option.sort.key === "total"
                                ? !option.sort.desc
                                : true,
                          };
                        }
                      });
                    }}
                  >
                    총합
                    {option.sort.key === "total" &&
                      (option.sort.desc ? (
                        <MoveDown className="size-3" />
                      ) : (
                        <MoveUp className="size-3" />
                      ))}
                  </Button>
                </TableHead>
              </>
            ) : (
              <>
                {[1, 0].map((direction) => (
                  <DropdownMenu key={direction}>
                    <DropdownMenuTrigger asChild>
                      <TableHead className="px-0 text-center">
                        <Button variant={"ghost"}>
                          {adjacentOptions[direction]}:{" "}
                          <span className="font-normal">
                            {option.wordTypes[direction] === "total"
                              ? "총합"
                              : moveTypeNameMap[
                                  option.wordTypes[direction] as MoveType
                                ].slice(0, 3)}
                          </span>
                          <ChevronsUpDown className="size-3" />
                        </Button>
                      </TableHead>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-50">
                      <DropdownMenuRadioGroup
                        value={String(option.wordTypes[direction])}
                        onValueChange={(e: string) => {
                          useWcStore.setState((state) => {
                            if (
                              state.wordDistributionOption.type !== "adjacent"
                            ) {
                              state.wordDistributionOption.wordTypes[
                                direction
                              ] =
                                e !== "total"
                                  ? (Number(e) as MoveType)
                                  : "total";
                            }
                          });
                        }}
                      >
                        {[0, 1, 2, 3, 4, 5].map((type) => (
                          <DropdownMenuRadioItem
                            value={`${type}`}
                            key={type}
                            circle={
                              <Ball variant={moveTypeToWordVariant[type]} />
                            }
                          >
                            {moveTypeNameMap[type]}
                          </DropdownMenuRadioItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem
                          value={`total`}
                          circle={<Ball variant={"default"} />}
                        >
                          총합
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
                <TableHead className="px-0 text-center">
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      useWcStore.setState((state) => {
                        if (state.wordDistributionOption.type !== "adjacent") {
                          state.wordDistributionOption.desc =
                            !state.wordDistributionOption.desc;
                        }
                      });
                    }}
                  >
                    {option.type === "ratio" ? "비율" : "차이"}
                    {option.desc ? (
                      <MoveDown className="size-3" />
                    ) : (
                      <MoveUp className="size-3" />
                    )}
                  </Button>
                </TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedData?.slice().map(({ char, num }) => (
            <TableRow key={char}>
              <TableCell className="text-center">
                <CharButton variant={nodeType} className="font-medium">
                  {char}
                </CharButton>
              </TableCell>
              {option.type === "adjacent" ? (
                <>
                  {moveTypes.map((key) => (
                    <TableCell className="text-center" key={`cell-${key}`}>
                      {formatValue(num[key])}
                    </TableCell>
                  ))}
                  <TableCell className="text-center">
                    {formatValue(sum(num))}
                  </TableCell>
                </>
              ) : (
                <>
                  {[0, 1, 2].map((key) => (
                    <TableCell className="text-center" key={`cell-${key}`}>
                      {formatValue(round(num[key], 1))}
                    </TableCell>
                  ))}
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationSimple
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
