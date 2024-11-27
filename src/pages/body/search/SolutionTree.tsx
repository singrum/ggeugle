import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import WordsTrail from "@/components/ui/WordsTrail";
import { useWC } from "@/lib/store/useWC";
import { TreeData, WCDisplay } from "@/lib/wc/WordChain";
import React, { useEffect, useMemo, useRef } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";
// @ts-ignore
import { Tree } from "./Tree";

export default function SolutionTree() {
  const [engine, searchInputValue] = useWC((e) => [
    e.engine,
    e.searchInputValue,
  ]);
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const data = useMemo(() => {
    return WCDisplay.getSolutionTree(engine!, searchInputValue);
  }, [engine, searchInputValue]);

  const maxTrail = useMemo(() => {
    return WCDisplay.getMaxTrail(engine!, searchInputValue);
  }, [engine, searchInputValue]);

  useEffect(() => {
    while (containerRef.current.lastChild) {
      containerRef.current.removeChild(containerRef.current.lastChild);
    }

    const treeElement = Tree(data, {
      label: (d: TreeData) => d.name,
      // width: 100,
      stroke: "hsl(var(--foreground))",
      halo: "hsl(var(--background))",
      fill: "hsl(var(--foreground))",
    });

    containerRef.current.appendChild(treeElement);
  }, [containerRef.current?.lastChild]);

  return (
    <>
      <div className="flex flex-col gap-3 py-4 items-center px-4 pb-0">
        <Popover>
          <PopoverTrigger>
            <Badge
              className="text-muted-foreground flex items-center gap-0"
              variant={"secondary"}
            >
              최적 경로
              <CircleHelp className="w-4 h-4 ml-1" />
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="text-sm">
            <div className="flex flex-col gap-1">
              <div>
                서로 <span className="font-semibold">최선의 수</span>를 택하며
                플레이 하였을 때 나타나는 경로.
                {engine?.chanGraph.nodes[searchInputValue].type === "win" ||
                  engine?.chanGraph.nodes[searchInputValue].type === "cirwin"}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="py-4 px-2">
          {maxTrail.length > 0 ? (
            <WordsTrail words={maxTrail} size="md" />
          ) : (
            <div className="font-medium text-sm text-muted-foreground">
              즉시 패배
            </div>
          )}
        </div>
        <Separator className="mx-4" />
      </div>

      <div className="flex flex-col gap-3 py-4 items-center w-full">
        <Badge
          className="text-muted-foreground flex items-center gap-1"
          variant={"secondary"}
        >
          게임 트리
        </Badge>
        <div className="h-[400px] overflow-hidden resize-y border-b w-full">
          <div
            className={`h-full min-w-[${
              (engine!.chanGraph.nodes[searchInputValue].endNum as number) * 900
            }rem]`}
            ref={containerRef}
          />
        </div>
      </div>
    </>
  );
}
