import type { EdgeMap } from "@/lib/wordchain/classes/edge-map";
import type { NodeName } from "@/lib/wordchain/graph/bipartite-digraph";

export type SearchInputType = "empty" | "winlose" | "route" | "word";
export type WinloseCharListData = { depth: number; nodes: NodeName[] }[];
export type WinloseWordListData = Record<
  number,
  [NodeName, NodeName, number][]
>;

export type RouteCharListData = [NodeName[], NodeName[]];

export type CharListData = WinloseCharListData | RouteCharListData;

export type WordVariant = "win" | "lose" | "route" | "removed";

export type MoveData = {
  removed: [string, string, number][];
  route: [string, string, number][];
  winlose: {
    win: { depth: number; moves: [string, string, number][] }[];
    lose: { depth: number; moves: [string, string, number][] }[];
  };
};

export type TreeData = (
  | { isWin: true; word: string[]; depth: number }
  | {
      isWin: false;
      words: string[][];
      selectedIndex: number;
      depth: number;
    }
)[];

export type ComparisonData = [NodeType, NodeType, NodeName[]][];

export type ComparisonMap = [
  Map<NodeName, [NodeType, NodeType]>,
  Map<NodeName, [NodeType, NodeType]>,
];

export type CriticalWordInfo = {
  word: string;
  difference?:
    | { win: NodeName[]; lose: NodeName[]; loopwin: NodeName[] }
    | undefined;
};

// export const precedenceMap: Record<MoveType, number> = {
//   "win-lose": 0,
//   "loopwin-loopwin": 0,
//   "route-route": 1,
//   removed: 2,
//   "lose-win": 3,
//   "lose-loopwin": 3,
//   "win-route": 4,
//   "route-win": 5,
//   "route-loopwin": 5,
//   "win-win": 5,
//   "loopwin-win": 5,
//   "win-loopwin": 5,
// };

export type MoveType = 0 | 1 | 2 | 3 | 4 | 5;

export type MoveInfoMap = EdgeMap<{
  nodeTypes: [NodeType, NodeType];
  wordIdx: number[];
  pairs: [NodeName, NodeName, number][];
}>;

// variant 가 "win" | "lose"인 것만 depth를 가짐
// 0,3,5,6 번째만 depth 가짐
// 1 번째만 connected 가짐
export type MoveClass = Record<number, MoveInfoMap>[];

export type MoveRow = {
  move: [NodeName, NodeName];
  nodeTypes: [NodeType, NodeType];
  words: string[];
  pairs: string[];
};

export type WordsCard = {
  moveType: MoveType;
  depth?: number | undefined;
  connected?: boolean | undefined;
  moveRows: MoveRow[];
};

export type SingleThreadSearechStatus = "pending" | "searching" | "done";

export type PrecedenceMaps = {
  edge: Record<NodeName, Record<NodeName, number>>;
  node: Record<NodeName, number>;
};

export type PrecInfo = {
  rule: number;
  mmDepth: number;
  maps: PrecedenceMaps;
};
