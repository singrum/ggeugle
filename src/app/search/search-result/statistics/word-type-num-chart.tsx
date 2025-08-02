import { Ball } from "@/components/ball";
import { NodeTypeLabel } from "@/components/node-type-label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  moveTypeNameMap,
  moveTypeToWordVariant,
} from "@/lib/wordchain/constants";
import type { WordSolver } from "@/lib/wordchain/word/word-solver";
import { useWcStore } from "@/stores/wc-store";
import { range } from "lodash";
import { MoveRight, TextSearch } from "lucide-react";
import { useMemo } from "react";
export default function WordTypeNumChart({ solver }: { solver: WordSolver }) {
  const data = useMemo(() => {
    return solver.graphSolver.getWordTypeNum();
  }, [solver]);
  
  const total = data.typeNum.reduce((prev, curr) => prev + curr, 0);
  const search = useWcStore((e) => e.search);
  return (
    <Card className="bg-card h-full border">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>{total.toLocaleString()} 단어</CardTitle>
          <Button
            size="sm"
            className="text-muted-foreground -mx-3 -my-2 max-h-full py-2"
            variant="ghost"
            onClick={() => search(".*")}
          >
            <TextSearch />
            목록
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <Accordion
          type="multiple"
          // collapsible
          defaultValue={undefined}
          className="w-full"
        >
          {range(6).map((i) => (
            <AccordionItem value={`${i}`} key={i} className="!border-none">
              <AccordionTrigger
                disabled={i === 2}
                className="hover:bg-accent dark:hover:bg-accent/50 rounded-none px-2 py-3 hover:no-underline"
              >
                <div className="flex flex-1 justify-between">
                  <div className="flex items-center gap-2 font-medium">
                    <Ball variant={moveTypeToWordVariant[i]} />

                    <div>{moveTypeNameMap[i]}</div>
                  </div>
                  <div className="font-normal">
                    {data.typeNum[i].toLocaleString()}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2 pb-4">
                {data.subtypeNum[i].map(([headType, tailType, num]) => (
                  <div
                    className="flex items-center justify-between pr-10"
                    key={`${headType}-${tailType}`}
                  >
                    <div className="flex items-center gap-1 pl-6">
                      <NodeTypeLabel nodeType={headType} />
                      <MoveRight className="size-2" />
                      <NodeTypeLabel nodeType={tailType} />
                    </div>

                    <div className="text-xs">{num.toLocaleString()}</div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
