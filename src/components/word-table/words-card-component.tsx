import { wordDispTypeInfo } from "@/constants/search";
import {
  hasDepthMap,
  moveTypeNameMap,
  moveTypeToWordVariant,
} from "@/lib/wordchain/constants";
import { useWcStore } from "@/stores/wc-store";
import type { MoveType, WordsCard } from "@/types/search";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Ball } from "../ball";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function WordsCardComponent({
  data,
  ...props
}: {
  data: WordsCard;
} & React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const wordDispType = useWcStore((e) => e.wordDispType);
  const { component: Component } = wordDispTypeInfo[wordDispType];
  return (
    <AccordionItem {...props} className="border-0">
      <div className="sticky top-0 z-40">
        <AccordionTrigger className="bg-background mb-1 rounded-none px-2 py-4 hover:no-underline">
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
      </div>
      <AccordionContent className="overflow-visible pb-8">
        <Component rows={data.moveRows} />
      </AccordionContent>
    </AccordionItem>
  );
}

function getLabel(moveType: MoveType, depth?: number) {
  return (
    `${moveTypeNameMap[moveType]}` +
    (hasDepthMap[moveType]
      ? ` (${depth} 수 이내 ${
          moveTypeToWordVariant[moveType] === "win" ? "승리" : "패배"
        })`
      : "")
  );
}
