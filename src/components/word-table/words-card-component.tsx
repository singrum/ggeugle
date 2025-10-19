import { pageSizeInfo, wordDispTypeInfo } from "@/constants/search";
import { cn } from "@/lib/utils";
import {
  hasDepthMap,
  moveTypeNameMap,
  moveTypeToWordVariant,
} from "@/lib/wordchain/constants";
import { useWcStore } from "@/stores/wc-store";
import type { MoveType, WordsCard } from "@/types/search";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useState } from "react";
import { Ball } from "../ball";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { PaginationSimple } from "../ui/pagination-simple";

export default function WordsCardComponent({
  data,
  open,
  ...props
}: {
  data: WordsCard;
  open: boolean;
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
  
  return (
    <div className={cn({ "pb-6 md:pb-8": open })}>
      <AccordionItem {...props} className="border-0">
        <div className="sticky top-[var(--header-height)] z-40">
          <AccordionTrigger className="bg-background mb-1 rounded-none px-2 py-4 hover:no-underline">
            <div className="flex flex-1 justify-between">
              <div className="flex items-center gap-2">
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

        <AccordionContent className="pb-0">
          <Component rows={currentRows} />
        </AccordionContent>
      </AccordionItem>
      {open && totalPages > 1 && (
        <PaginationSimple
          className="sticky bottom-0 z-20"
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
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
