import { typeMap } from "@/constants/search";
import type { NodeType } from "@/lib/wordchain/graph/graph";
import { Ball } from "./ball";

export function NodeTypeLabel({ nodeType }: { nodeType: NodeType }) {
  return (
    <div className="flex items-center gap-1">
      <Ball variant={nodeType} />
      <span className="text-xs">{typeMap[nodeType]}</span>
    </div>
  );
}
