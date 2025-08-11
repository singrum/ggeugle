export type NodeType = "win" | "loopwin" | "lose" | "route";
export type NormalizedNodeType = "win" | "lose" | "route";
export type NodeName = string;

export type NodeMap<T> = [Map<NodeName, T>, Map<NodeName, T>];

export type NodePos = 0 | 1;
export type NodeInfo = [NodePos, NodeName];
export type SingleMove = [NodeName, NodeName];
export type Edge = [NodeName, NodeName, number];

export type SingleEdgeAdj = Record<NodeName, Record<NodeName, number>>;
export type MultiEdgeAdj = Record<NodeName, Record<NodeName, number>>;
