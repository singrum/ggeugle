import { useWC } from "@/lib/store/useWC";
import { TreeData, WCDisplay } from "@/lib/wc/wordChain";
import React, { useEffect, useMemo, useRef } from "react";
import { select, json, tree, hierarchy } from "d3";
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
    <div className="h-[400px] overflow-hidden resize-y border-border border rounded-lg">
      <div
        className={`h-full min-w-[${
          (engine!.chanGraph.nodes[searchInputValue].endNum as number) * 900
        }rem]`}
        ref={containerRef}
      />
    </div>
  );
}
