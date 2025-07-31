import type { ChangeFunc } from "@/types/rule";
import { EdgeCounter } from "../classes/edge-counter";
import { BipartiteDiGraph } from "./bipartite-digraph";
import type { NodeName, NodePos } from "./graph";

export class GraphPartitions {
  keys: string[];
  content: Record<string, BipartiteDiGraph>;

  constructor(graphsObj: Record<string, BipartiteDiGraph>, keys: string[]) {
    this.keys = keys;
    this.content = graphsObj;
  }

  static fromObj(obj: GraphPartitions): GraphPartitions {
    const result = Object.create(GraphPartitions.prototype);
    const content: Record<string, BipartiteDiGraph> = {};
    for (const key in obj.content) {
      content[key] = BipartiteDiGraph.fromObj(obj.content[key]);
    }
    result.content = content;
    result.keys = obj.keys;
    return result;
  }
  copy() {
    const content: Record<string, BipartiteDiGraph> = {};
    for (const key in this.content) {
      content[key] = this.content[key].copy();
    }
    const result = new GraphPartitions(content, [...this.keys]);
    return result;
  }

  transferNode(from: string, to: string, pos: NodePos, node: NodeName) {
    const edges = this.content[from].removeNode(pos, node);

    for (const pos of [0, 1] as NodePos[]) {
      edges[pos].forEach((e) =>
        this.content[to].setEdge(pos, e[0], e[1], e[2]),
      );
    }
  }
  transferEdge(
    from: string,
    to: string,
    start: NodeName,
    end: NodeName,
    num: number,
  ) {
    this.content[from].decreaseEdge(start, end, num);
    this.content[to].increaseEdge(start, end, num);
  }
  successors(pos: NodePos, name: NodeName): NodeName[] {
    const graphs = Object.values(this.content);
    return graphs
      .map((e) => (e.hasNode(pos, name) ? e.successors(pos, name) : []))
      .flat();
  }
  predecessors(pos: NodePos, name: NodeName): NodeName[] {
    const graphs = Object.values(this.content);
    return graphs
      .map((e) => (e.hasNode(pos, name) ? e.predecessors(pos, name) : []))
      .flat();
  }
  getKeys(): string[] {
    return this.keys;
  }
  getMoveViewNodes(
    pos: NodePos,
    node: NodeName,
    direction: NodePos,
    changeFunc?: ChangeFunc,
    keys?: string[],
  ) {
    keys = keys ?? this.getKeys();
    return [
      ...new Set(
        keys
          .map((key) =>
            this.getGraph(key).getMoveViewNodes(
              pos,
              node,
              direction,
              changeFunc,
            ),
          )
          .flat(),
      ),
    ];
  }
  getMovesFromNode(
    node: NodeName,
    view: NodePos,
    direction: NodePos,
    changeFunc?: ChangeFunc,
    keys?: string[] | undefined,
  ): [NodeName, NodeName][] {
    keys = keys ?? this.getKeys();
    const movePosNodes = this.getMoveViewNodes(
      view as NodePos,
      node,
      direction,
      changeFunc,
      keys,
    );

    const counter = new EdgeCounter();

    for (const key of keys) {
      const moves = movePosNodes
        .map((e) =>
          this.content[key].getMovesFromNode(e, 1, direction, changeFunc),
        )
        .flat();
      for (const move of moves) {
        counter.increase(...move);
      }
    }

    return counter.toArray().map((e) => [e[0], e[1]]);
  }
  getEdgeNumAndOffet(
    start: NodeName,
    end: NodeName,
    key?: string | undefined, // undefined일 땐 모든 엣지 다 구하기
  ): // EdgeNum, offset
  [number, number] {
    let offset = 0;
    for (const key_ of this.keys) {
      if (key_ !== key) {
        offset += this.getGraph(key_).getEdgeNum(start, end);
      } else {
        return [this.getGraph(key).getEdgeNum(start, end), offset];
      }
    }

    if (key === undefined) {
      return [offset, 0];
    }
    throw new Error("key not in graph Partition" + this.keys);
  }
  getEdgeIdxRange(
    start: NodeName,
    end: NodeName,
    key?: string | undefined,
  ): [number, number] {
    const [num, offset] = this.getEdgeNumAndOffet(start, end, key);
    return [offset, offset + num];
  }

  union(): BipartiteDiGraph {
    const graph = new BipartiteDiGraph();
    for (const g of Object.values(this.content)) {
      for (const [start, end] of g.edges(0)) {
        graph.setEdge(0, start, end);
      }
      for (const [start, end] of g.edges(1)) {
        graph.increaseEdge(start, end, g.getEdgeNum(start, end));
      }
    }

    return graph;
  }
  updateUnion(to: string): BipartiteDiGraph {
    const toGraph = this.getGraph(to);
    const otherGraphs = this.getKeys().filter((e) => e !== to);

    for (const key of otherGraphs) {
      const g = this.getGraph(key);

      for (const [start, end] of g.edges(0)) {
        toGraph.setEdge(0, start, end);
      }
      for (const [start, end, num] of g.edges(1)) {
        toGraph.increaseEdge(start, end, num);
      }
    }
    return toGraph;
  }
  getGraph(key: string) {
    return this.content[key];
  }
  isEmpty() {
    return Object.values(this.content).every((graph) => graph.isEmpty());
  }
}
