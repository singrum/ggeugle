import type { MoveType, WordVariant } from "@/types/search";
import type { NodeType } from "./graph/graph";

export const nodeTypesToMoveType: Record<
  NodeType,
  Record<NodeType, MoveType | undefined>
> = {
  win: {
    lose: 0,
    route: 4,
    win: 5,
    loopwin: 5,
  },
  loopwin: {
    loopwin: 0, // loopMap에 있으면 0, 없으면 5
    win: 5,
    lose: undefined,
    route: undefined,
  },
  route: {
    route: 1,
    win: 5,
    loopwin: 5,
    lose: undefined,
  },
  lose: {
    win: 3,
    loopwin: 3,
    lose: undefined,
    route: undefined,
  },
};
export const moveTypeToNodeTypes: [NodeType, NodeType][][] = [
  [
    ["win", "lose"],
    ["loopwin", "loopwin"],
  ],
  [["route", "route"]],
  [],
  [
    ["lose", "win"],
    ["lose", "loopwin"],
  ],
  [["win", "route"]],
  [
    ["route", "win"],
    ["route", "loopwin"],
    ["win", "win"],
    ["win", "loopwin"],
    ["loopwin", "win"],
    ["loopwin", "loopwin"],
  ],
];

export const moveTypeToWordVariant: WordVariant[] = [
  "win",
  "route",
  "removed",
  "lose",
  "route",
  "lose",
];

export const hasDepthMap: boolean[] = [true, false, false, true, false, true];

export const moveTypeNameMap: string[] = [
  "공격 단어",
  "루트 단어",
  "돌림 단어",
  "방어 단어",
  "공뤁 단어",
  "양보 단어",
];

export const indexToNodeType: NodeType[] = ["win", "lose", "loopwin", "route"];
