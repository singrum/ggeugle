import type { ChangeFunc } from "@/types/rule";
import type { PrecedenceMaps } from "@/types/search";
import { cloneDeep } from "lodash";
import { EdgeCounter } from "../classes/edge-counter";
import type { WordMap } from "../word/word-map";
import { DiGraph } from "./digraph";
import type { NodeMap, NodeName, NodePos } from "./graph";

export class BipartiteDiGraph {
  _nodes: [Set<NodeName>, Set<NodeName>];
  _succ: [EdgeCounter, EdgeCounter]; // 모든 nodes가 키에 존재해야 함, EdgeInfo.num 0은 존재하지 말아야 함
  _pred: [EdgeCounter, EdgeCounter]; // 모든 nodes가 키에 존재해야 함, EdgeInfo.num 0은 존재하지 말아야 함

  constructor() {
    this._nodes = [new Set(), new Set()];
    this._succ = [new EdgeCounter(), new EdgeCounter()];
    this._pred = [new EdgeCounter(), new EdgeCounter()];
  }

  static fromObj(obj: BipartiteDiGraph): BipartiteDiGraph {
    const result: BipartiteDiGraph = new BipartiteDiGraph();
    result._nodes = obj._nodes;
    result._succ = [0, 1].map((pos) =>
      EdgeCounter.fromEdgeCounter(obj._succ[pos]),
    ) as [EdgeCounter, EdgeCounter];
    result._pred = [0, 1].map((pos) =>
      EdgeCounter.fromEdgeCounter(obj._pred[pos]),
    ) as [EdgeCounter, EdgeCounter];

    return result;
  }
  static fromWordMap(
    wordMap: WordMap,
    changeFunc: ChangeFunc,
  ): BipartiteDiGraph {
    const graph: BipartiteDiGraph = new BipartiteDiGraph();
    for (const [head, tail, arr] of wordMap.toArray()) {
      if (arr.length > 0) graph.setEdge(1, head, tail, arr.length);
    }

    for (const node of graph.nodes(0)) {
      for (const next of changeFunc
        .forward(node)
        .filter((e) => graph.hasNode(1, e))) {
        graph.setEdge(0, node, next);
      }
    }
    return graph;
  }

  nodes(pos: NodePos): NodeName[] {
    return [...this._nodes[pos]];
  }
  edges(fromPos: NodePos): [NodeName, NodeName, number][] {
    return this._succ[fromPos].toArray();
  }

  hasNode(pos: NodePos, node: NodeName): boolean {
    return this._nodes[pos].has(node);
  }

  addNode(pos: NodePos, node: NodeName) {
    if (!this.hasNode(pos, node)) {
      this._nodes[pos].add(node);
    }
  }
  hasEdge(fromPos: NodePos, start: NodeName, end: NodeName): boolean {
    return !!this._succ[fromPos].get(start, end);
  }

  getEdgeNum(start: NodeName, end: NodeName) {
    return this._succ[1].get(start, end) || 0;
  }

  setEdge(fromPos: NodePos, start: NodeName, end: NodeName, num: number = 1) {
    const oppos = getOppos(fromPos);
    this.addNode(fromPos, start);
    this.addNode(oppos, end);

    this._succ[fromPos].set(start, end, num);
    this._pred[oppos].set(end, start, num);
  }

  increaseEdge(start: NodeName, end: NodeName, num: number = 1) {
    this.addNode(1, start);
    this.addNode(0, end);
    if (num > 0) {
      this._succ[1].increase(start, end, num);
      this._pred[0].increase(end, start, num);
    }
  }

  predecessors(pos: NodePos, node: NodeName): NodeName[] {
    if (!this.hasNode(pos, node)) {
      throw new Error(`there is not node ${node} in pos ${pos}`);
    }
    const succ = this._pred[pos].getSucc(node);

    return succ.map((e) => e[0]);
  }

  successors(pos: NodePos, node: NodeName): NodeName[] {
    if (!this.hasNode(pos, node)) {
      throw new Error(`there is not node ${node} in pos ${pos}`);
    }
    const succ = this._succ[pos].getSucc(node);

    return succ.map((e) => e[0]);
  }

  removeNode(
    pos: NodePos,
    node: NodeName,
  ): //outedges, inedges 반환
  [[NodeName, NodeName, number][], [NodeName, NodeName, number][]] {
    if (!this.hasNode(pos, node)) {
      throw new Error(`${node} in pos ${pos} not exists`);
    }

    const edges: [
      [NodeName, NodeName, number][],
      [NodeName, NodeName, number][],
    ] = [[], []];

    const oppos = getOppos(pos);

    for (const succ of this.successors(pos, node)) {
      edges[pos].push([node, succ, this._pred[oppos].get(succ, node)]);
      this._pred[oppos].remove(succ, node);
    }
    this._succ[pos].remove(node);

    for (const pred of this.predecessors(pos, node)) {
      edges[oppos].push([pred, node, this._succ[oppos].get(pred, node)]);
      this._succ[oppos].remove(pred, node);
    }
    this._pred[pos].remove(node);

    this._nodes[pos].delete(node);

    return edges;
  }

  decreaseEdge(start: NodeName, end: NodeName, num: number = 1) {
    this._succ[1].decrease(start, end, num);
    this._pred[0].decrease(end, start, num);
  }

  removeEdge(fromPos: NodePos, start: NodeName, end: NodeName) {
    const oppos = getOppos(fromPos);
    this._succ[fromPos].remove(start, end);
    this._pred[oppos].remove(end, start);
  }

  outDegree(pos: NodePos, nodeName: NodeName): number {
    return this.successors(pos, nodeName).length;
  }
  inDegree(pos: NodePos, nodeName: NodeName): number {
    return this.predecessors(pos, nodeName).length;
  }

  getSingleOutEdges(): [NodeName, NodeName][] {
    return this.nodes(0)
      .filter((e) => this.outDegree(0, e) === 1)
      .map((e) => [e, this.successors(0, e)[0]]);
  }
  getSingleInEdges(): [NodeName, NodeName][] {
    return this.nodes(1)
      .filter((e) => this.inDegree(1, e) === 1)
      .map((e) => [e, this.predecessors(1, e)[0]]);
  }
  getSingleInOutEdges(): [NodeName, NodeName][] {
    const hashMap: Record<string, Record<string, number>> = {};
    const sie = this.getSingleInEdges();
    const soe = this.getSingleOutEdges();

    for (const [start, end] of sie) {
      if (!hashMap[start]) {
        hashMap[start] = {};
      }
      hashMap[start][end] = 1;
    }
    for (const [start, end] of soe) {
      if (!hashMap[start]) {
        hashMap[start] = {};
      }
      hashMap[start][end] = 1;
    }
    const result = Object.entries(hashMap)
      .map(([start, adj]: [string, Record<string, number>]) =>
        Object.entries(adj).map(([end]) => [start, end]),
      )
      .flat() as [NodeName, NodeName][];

    return result;
  }

  getSCC(): [string[], string[]][] {
    let id = 0;

    const nodes: [NodePos, NodeName][] = [
      ...this.nodes(0).map((e) => [0, e] as [NodePos, NodeName]),
      ...this.nodes(1).map((e) => [1, e] as [NodePos, NodeName]),
    ];
    const d: [Record<NodeName, number>, Record<NodeName, number>] = [{}, {}];

    const finished: [Record<NodeName, boolean>, Record<NodeName, boolean>] = [
      {},
      {},
    ];

    for (const [pos, node] of nodes) {
      d[pos][node] = 0;
      finished[pos][node] = false;
    }

    const SCC: [NodeName[], NodeName[]][] = [];
    const stack: [NodePos, NodeName][] = [];

    const dfs = (pos: NodePos, name: NodeName) => {
      d[pos][name] = ++id;
      stack.push([pos, name]);

      let parent = d[pos][name];
      const oppos: NodePos = (1 - pos) as NodePos;
      const succ: NodeName[] = this.successors(pos, name);

      for (let i = 0; i < succ.length; i++) {
        const next = succ[i];
        if (d[oppos][next] === 0) parent = Math.min(parent, dfs(oppos, next));
        else if (!finished[oppos][next])
          parent = Math.min(parent, d[oppos][next]);
      }

      if (parent === d[pos][name]) {
        const scc: [NodeName[], NodeName[]] = [[], []];
        while (true) {
          const [pos_, name_] = stack.pop()!;
          scc[pos_].push(name_);
          finished[pos_][name_] = true;
          if (pos === pos_ && name === name_) break;
        }

        SCC.push(scc);
      }

      return parent;
    };

    for (const [pos, node] of nodes) {
      if (d[pos][node] === 0) {
        dfs(pos, node);
      }
    }

    return SCC;
  }
  getTwoPaths(pos: NodePos) {
    const result: [NodeName, NodeName, NodeName][] = [];
    for (const node of this.nodes(pos)) {
      const edges = this.successors(pos, node).map((succ) => [node, succ]);

      const paths = edges
        .map(([start, end]) =>
          this.successors((1 - pos) as NodePos, end).map(
            (succ) => [start, end, succ] as [NodeName, NodeName, NodeName],
          ),
        )
        .flat();
      result.push(...paths);
    }
    return result;
  }

  condensation(
    scc: [NodeName[], NodeName[]][] | undefined,
    pos: 0 | 1,
  ): [
    DiGraph<number, { edges: EdgeCounter }>,
    Record<NodeName, number>,
    Record<number, NodeName[]>,
  ] {
    if (scc === undefined) {
      scc = this.getSCC();
    }
    const sccInView: NodeName[][] = scc
      .map((e) => e[pos])
      .filter((e) => e.length > 0);

    const mapping: Record<NodeName, number> = {};
    const members: Record<number, NodeName[]> = {};
    for (const [i, nodes] of Object.entries(sccInView)) {
      members[Number(i)] = nodes;
      nodes.forEach((e) => {
        mapping[e] = Number(i);
      });
    }

    const G = new DiGraph<number, { edges: EdgeCounter }>();

    for (const [start, middle, end] of this.getTwoPaths(pos)) {
      const startIndex = mapping[start];
      const endIndex = mapping[end];
      if (startIndex !== endIndex) {
        if (!G.hasEdge(startIndex, endIndex)) {
          G.addEdge(startIndex, endIndex, { edges: new EdgeCounter() });
        }

        const prop = G.getProp(startIndex, endIndex);

        if (pos === 0) {
          prop!.edges.increase(middle, end);
        } else {
          prop!.edges.increase(start, middle);
        }
      }
    }

    return [G, mapping, members];
  }

  // 리턴하는 노드들은 그래프 내에 존재해야 함
  getMoveViewNodes(
    pos: NodePos,
    node: NodeName,
    direction: NodePos,
    changeFunc?: ChangeFunc,
  ): NodeName[] {
    if (this.hasNode(pos, node)) {
      if (pos + direction === 1) {
        return [node];
      } else {
        return direction === 0
          ? this.successors(0, node)
          : this.predecessors(1, node);
      }
    } else if ((pos ^ direction) === 1) {
      return [];
    } else if (changeFunc) {
      return direction === 0
        ? changeFunc.forward(node).filter((e) => this.hasNode(1, e))
        : changeFunc.backward(node).filter((e) => this.hasNode(0, e));
    } else {
      return [];
    }
  }

  // direction === 0 -> forward, 1 -> backward
  // view direction nodepos
  // 0    0         0
  // 0    1         1
  // 1    0         1
  // 1    1         0

  getMovesFromNode(
    node: NodeName,
    view: NodePos,
    direction: NodePos,
    changeFunc?: ChangeFunc,
  ): [NodeName, NodeName][] {
    const moveViewNodes = this.getMoveViewNodes(
      (direction ^ view) as NodePos,
      node,
      direction,
      changeFunc,
    );
    const result = moveViewNodes
      .map((e) =>
        direction === 0
          ? this.successors(1, e).map((end) => [e, end])
          : this.predecessors(0, e).map((start) => [start, e]),
      )
      .flat() as [string, string][];

    return result;
  }

  getOutDegreeMap(): NodeMap<number> {
    const outDegreeMap: NodeMap<number> = ([0, 1] as NodePos[]).map((pos) =>
      Object.fromEntries(
        this.nodes(pos).map((e) => [e, this.outDegree(pos, e)]),
      ),
    ) as NodeMap<number>;
    return outDegreeMap;
  }
  getEvenLoops(): [string, string, number][] {
    const singleOutEdges: [NodeName, NodeName][] = this.getSingleInOutEdges();
    const evenLoops: [NodeName, NodeName, number][] = [];

    for (const [start, end] of singleOutEdges) {
      const num = this.getEdgeNum(end, start);
      if (num >= 2) {
        const deleteNum = num - (num % 2);
        evenLoops.push([end, start, deleteNum]);
      }
    }
    return evenLoops;
  }
  getTwoCycles(): [[NodeName, NodeName], [NodeName, NodeName], number][] {
    const singleOutEdges: [NodeName, NodeName][] = this.getSingleInOutEdges();

    const twoCycles: [[NodeName, NodeName], [NodeName, NodeName], number][] =
      [];
    const counter = new EdgeCounter();

    for (let i = 0; i < singleOutEdges.length - 1; i++) {
      const [head1, tail1] = singleOutEdges[i];

      for (let j = i + 1; j < singleOutEdges.length; j++) {
        const [head2, tail2] = singleOutEdges[j];
        const num1 = this.getEdgeNum(tail1, head2) - counter.get(tail1, head2);
        const num2 = this.getEdgeNum(tail2, head1) - counter.get(tail2, head1);

        if (num1 > 0 && num2 > 0) {
          const deleteNum = Math.min(num1, num2);

          counter.increase(tail1, head2, deleteNum);
          counter.increase(tail2, head1, deleteNum);
          twoCycles.push([[tail1, head2], [tail2, head1], deleteNum]);
        }
      }
    }

    return twoCycles;
  }
  copy(): BipartiteDiGraph {
    return cloneDeep(this);
  }
  getHanbangMoves(): [NodeName, NodeName, number][] {
    return this.getHanbangNodes()
      .map((e) =>
        this.predecessors(0, e).map(
          (pred) =>
            [pred, e, this.getEdgeNum(pred, e)] as [NodeName, NodeName, number],
        ),
      )
      .flat();
  }
  getHanbangNodes(): NodeName[] {
    const sinks: [NodeName[], NodeName[]] = ([0, 1] as NodePos[]).map((i) =>
      this.getSinks(i),
    ) as [NodeName[], NodeName[]];
    const sinks0: Set<NodeName> = new Set(sinks[0]);
    return [...sinks0];
  }
  getSinks(pos: NodePos): NodeName[] {
    return this.nodes(pos).filter((e) => this.outDegree(pos, e) === 0);
  }
  getReachableNodes(
    pos: NodePos,
    name: NodeName,
  ): [Set<NodeName>, Set<NodeName>] {
    const visited: [Set<NodeName>, Set<NodeName>] = [new Set(), new Set()];
    visited[pos].add(name);

    const stack: [NodePos, NodeName][] = [[pos, name]];
    while (stack.length > 0) {
      const [pos, name] = stack.pop()!;
      const oppos = getOppos(pos);
      const succs = this.successors(pos, name);
      for (const succ of succs) {
        if (visited[oppos].has(succ)) {
          continue;
        }
        stack.push([oppos, succ]);
        visited[oppos].add(succ);
      }
    }

    return visited;
  }
  getInducedSubgraph(nodes: [Set<NodeName>, Set<NodeName>]) {
    const graph = new BipartiteDiGraph();

    for (const pos of [0, 1] as NodePos[]) {
      const oppos = getOppos(pos);
      for (const node of nodes[pos]) {
        graph.addNode(pos, node);
        const succ = this.successors(pos, node).filter((e) =>
          nodes[oppos].has(e),
        );

        for (const end of succ) {
          graph.setEdge(
            pos,
            node,
            end,
            pos === 0 ? 1 : this.getEdgeNum(node, end),
          );
        }
      }
    }

    return graph;
  }

  getCriticalEdges(): [NodeName, NodeName][] {
    const soe = this.getSingleOutEdges();
    const result = [];
    const chars: Set<NodeName> = new Set();
    for (const [, end] of soe) {
      chars.add(end);
    }

    for (const char of chars) {
      const tail = char;
      const succ = this.successors(1, tail);
      if (succ.length > 1) {
        continue;
      }
      if (succ.length === 0) {
        throw new Error("getCriticalWords Error");
      }

      if (this.getEdgeNum(tail, succ[0]) === 1) {
        result.push([tail, succ[0]] as [NodeName, NodeName]);
      }
    }

    return result;
  }
  getAllMoveNum() {
    const edges = this.edges(1);
    return edges.reduce((prev, curr) => prev + curr[2], 0);
  }

  compareNextMoveNum(
    move1: [NodeName, NodeName],
    move2: [NodeName, NodeName],
    precRule: number,
    precMap: PrecedenceMaps,
  ) {
    const result: number[] = [Infinity, Infinity];
    const moves = [move1, move2];

    // 1
    for (const i of [0, 1]) {
      const [start, end] = moves[i];
      const key: number = precMap.edge[start]?.[end];
      if (key !== undefined) {
        result[i] = key;
      }
    }

    let value = result[0] - result[1];

    if (!isNaN(value) && value !== 0) {
      return result[0] - result[1];
    }

    // 2
    for (const i of [0, 1]) {
      const [, end] = moves[i];
      const key = precMap.node[end];
      if (key !== undefined) {
        result[i] = key;
      }
    }
    value = result[0] - result[1];
    if (!isNaN(value) && value !== 0) {
      return result[0] - result[1];
    }

    // 3
    for (const i of [0, 1]) {
      const [, end] = moves[i];
      const nextMoves = this.getMovesFromNode(end, 0, 0);
      const nextNum = nextMoves.reduce(
        (prev, curr) => prev + this.getEdgeNum(curr[0], curr[1]),
        0,
      );
      result[i] = nextNum;

      if (precRule !== 0) {
        const prevMoves = this.getMovesFromNode(end, 0, 1);
        const prevNum = prevMoves.reduce(
          (prev, curr) => prev + this.getEdgeNum(curr[0], curr[1]),
          0,
        );
        if (precRule === 1) {
          result[i] -= prevNum;
        } else {
          result[i] /= prevNum;
        }
      }
    }
    return result[0] - result[1];
  }
  getReachableGraph(pos: NodePos, node: NodeName) {
    const reachableNodes = this.getReachableNodes(pos, node);
    return this.getInducedSubgraph(reachableNodes);
  }
  nextWordsLimitNodes(pos: NodePos, limit: number): NodeName[] {
    const nodes = this.nodes(pos);
    const result: NodeName[] = [];
    for (const node of nodes) {
      const movePosNode = this.getMoveViewNodes(pos, node, 0);

      if (
        movePosNode.reduce(
          (prev, curr) =>
            prev +
            this.successors(1, curr).reduce(
              (a, b) => a + this.getEdgeNum(curr, b),
              0,
            ),
          0,
        ) < limit
      ) {
        result.push(node);
      }
    }

    return result;
  }
  isEmpty(): boolean {
    return this._succ[1].content.size === 0;
  }
}

export function getOppos(pos: NodePos): NodePos {
  return (1 - pos) as NodePos;
}
