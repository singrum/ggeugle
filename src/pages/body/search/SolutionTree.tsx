import WordsTrail from "@/components/ui/WordsTrail";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useWC } from "@/lib/store/useWC";
import { TreeInfo, WCDisplay, Word } from "@/lib/wc/WordChain";
import { cloneDeep } from "lodash";
import { CircleHelp } from "lucide-react";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export default function SolutionTree() {
  const [engine, searchInputValue] = useWC((e) => [
    e.engine,
    e.searchInputValue,
  ]);

  const [treeInfo, setTreeInfo] = useState<TreeInfo>(
    WCDisplay.getTree(engine!, searchInputValue)
  );
  useEffect(() => {
    setTreeInfo(WCDisplay.getTree(engine!, searchInputValue));
  }, [engine, searchInputValue]);

  const maxTrail = useMemo(() => {
    return WCDisplay.getMaxTrail(engine!, searchInputValue);
  }, [engine, searchInputValue]);

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
          트리 탐색
        </Badge>
        <div className="w-full px-6">
          <Tree treeInfo={treeInfo} setTreeInfo={setTreeInfo} />
        </div>
      </div>
    </>
  );
}

function TreeNode({
  type,
  children,
}: {
  type: "win" | "los";
  children?: ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <div className="pt-[6px]">
        <div
          className={cn(
            `ring-offset-0 ring-2 ring-background w-3 h-3 rounded-full bg-${type}`
          )}
        />
      </div>

      {children}
    </div>
  );
}

function Tree({
  treeInfo,
  setTreeInfo,
}: {
  treeInfo: {
    type: "win" | "los";
    win: Word[];
    los: { mainIdx: number; words: Word[] }[];
  };
  setTreeInfo: React.Dispatch<React.SetStateAction<TreeInfo>>;
}) {
  const [engine] = useWC((e) => [e.engine]);
  const nodes = [];
  if (treeInfo.type === "win") {
    nodes.push(
      <TreeNode type={"win"}>
        <button className="font-medium">{treeInfo.win[0]}</button>
      </TreeNode>
    );
  }
  for (let i = 0; i < treeInfo.los.length; i++) {
    const losInfo = treeInfo.los[i];
    const winWord = treeInfo.win[i + (treeInfo.type === "win" ? 1 : 0)];

    nodes.push(
      <TreeNode type={"los"}>
        <div className="flex flex-wrap gap-x-2 gap-y-1 font-medium">
          {losInfo.words.map((losWord, wordIdx) => (
            <button
              className={cn("text-muted-foreground", {
                "text-foreground": wordIdx === losInfo.mainIdx,
              })}
              key={losWord}
              onClick={() => {
                if (wordIdx === losInfo.mainIdx) return;
                const changed = WCDisplay.changeTree(
                  engine!,
                  cloneDeep(treeInfo),
                  i,
                  wordIdx
                );
                console.log(changed, i, wordIdx);
                setTreeInfo(changed);
              }}
            >
              {losWord}
            </button>
          ))}
        </div>
      </TreeNode>,
      <TreeNode type={"win"}>
        <button className="font-medium">{winWord}</button>
      </TreeNode>
    );
  }
  return (
    <div className="relative">
      <div className="h-[calc(100%-24px)] absolute bg-muted-foreground w-0.5 left-[6px] top-[12px] translate-x-[-50%]"></div>
      <div className="flex flex-col gap-4 relative">
        {nodes.map((e, i) => (
          <React.Fragment key={i}>{e}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
