import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { PaginationSimple } from "~/components/ui/pagination-simple";
import { pageSizeInfo, wordDispTypeInfo } from "~/constants/search";
import { separateMoveRows } from "~/lib/utils";
import {
  hasDepthMap,
  moveTypeNameMap,
  moveTypeToWordVariant,
} from "~/lib/wordchain/constants";
import { useWcStore } from "~/stores/wc-store-provider";
import type { MoveType, WordsCard } from "~/types/search";
import { Ball } from "../../../+components/ball";

export default function WordsCardComponent({
  data,
  ...props
}: {
  data: WordsCard;
} & React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const wordDispType = useWcStore((e) => e.wordDispType);
  const { component: Component } = wordDispTypeInfo[wordDispType];
  const [page, setPage] = useState(1);
  const pageSize = useWcStore((e) => e.pageSize);
  const totalPages = Math.ceil(
    data.moveRows.length / pageSizeInfo[pageSize].value,
  );
  const start = (page - 1) * pageSizeInfo[pageSize].value;
  const currentRows = data.moveRows.slice(
    start,
    start + pageSizeInfo[pageSize].value,
  );
  const wordSortType = useWcStore((e) => e.wordSortType);

  return (
    <div>
      <AccordionItem {...props} className="border-0">
        <div className="sticky top-0 z-40">
          <AccordionTrigger className="bg-background mb-1 max-w-full rounded-none px-2 py-4 hover:no-underline">
            <div className="flex min-w-0 flex-1 justify-between">
              <div className="flex max-w-full flex-1 items-center gap-2 overflow-hidden text-nowrap">
                <Ball variant={moveTypeToWordVariant[data.moveType]} />
                {getLabel(data.moveType, data.depth, data.connected)}
              </div>
              <div className="text-muted-foreground font-normal">
                {data.moveRows
                  .reduce((prev, curr) => prev + curr.words.length, 0)
                  .toLocaleString()}
              </div>
            </div>
          </AccordionTrigger>
        </div>

        <AccordionContent>
          <Component
            rows={
              wordSortType === 0
                ? currentRows
                : separateMoveRows(currentRows).sort((a, b) => {
                    const aWord = a.words[0];
                    const bWord = b.words[0];
                    if (aWord === bWord) return 0;
                    return aWord < bWord ? -1 : 1;
                  })
            }
          />
          {totalPages > 0 && (
            <PaginationSimple
              className="sticky z-20 bottom-16 lg:bottom-0"
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

function getLabel(moveType: MoveType, depth?: number, connected?: boolean) {
  return (
    `${moveTypeNameMap[moveType]}` +
    (hasDepthMap[moveType]
      ? ` (${depth} 수 이내 ${
          moveTypeToWordVariant[moveType] === "win" ? "승리" : "패배"
        })`
      : connected !== undefined
        ? ` (${connected ? "비연결" : "연결"})`
        : ``)
  );
}
