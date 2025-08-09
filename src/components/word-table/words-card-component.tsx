import {
  hasDepthMap,
  moveTypeNameMap,
  moveTypeToWordVariant,
} from "@/lib/wordchain/constants";
import type { MoveType, WordsCard } from "@/types/search";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Ball } from "../ball";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import WordsTable from "./word-table";
export default function WordsCardComponent({
  data,
  ...props
}: {
  data: WordsCard;
} & React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionItem {...props} className="border-0">
      <AccordionTrigger className="bg-background hover:bg-accent dark:hover:bg-accent/50 top-0 mb-1 px-2 py-4 hover:no-underline">
        <div className="flex flex-1 justify-between">
          <div className="flex items-center gap-2">
            <Ball variant={moveTypeToWordVariant[data.moveType]} />
            {getLabel(data.moveType, data.depth)}
          </div>
          <div className="text-muted-foreground font-normal">
            {data.moveRows
              .reduce((prev, curr) => prev + curr.words.length, 0)
              .toLocaleString()}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-12 md:pb-12">
        <WordsTable rows={data.moveRows} />
      </AccordionContent>
    </AccordionItem>
  );
}

function getLabel(moveType: MoveType, depth?: number) {
  return (
    `${moveTypeNameMap[moveType]}` +
    (hasDepthMap[moveType]
      ? ` (${depth} 수 이내 ${moveTypeToWordVariant[moveType] === "win" ? "승리" : "패배"})`
      : "")
  );
}
