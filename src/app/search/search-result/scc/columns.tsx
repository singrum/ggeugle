import type { NodeName } from "@/lib/wordchain/graph/graph";

export type SccInfo = {
  label: NodeName;
  componentNodes: NodeName[];
  nextComp: NodeName;
};
