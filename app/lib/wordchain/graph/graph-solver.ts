import { range, round, sum } from "lodash-es";
import { toNestedRecord } from "~/lib/utils";
import type { ChangeFunc } from "~/types/rule";
import type {
  ComparisonData,
  ComparisonMap,
  MoveClass,
  MoveType,
  RouteCharListData,
} from "~/types/search";
import { EdgeMap } from "../classes/edge-map";
import {
  hasDepthMap,
  moveTypeToNodeTypes,
  nodeTypesToMoveType,
} from "../constants";
import { BipartiteDiGraph, getOppos } from "./bipartite-digraph";
import { classify, getDepthMap } from "./classify";
import type {
  NodeMap,
  NodeName,
  NodePos,
  NodeType,
  NormalizedNodeType,
} from "./graph";
import { GraphPartitions } from "./graph-partitions";
import { PairManager } from "./pair-manager";

export class GraphSolver {
  graphs: GraphPartitions;
  typeMap: NodeMap<NodeType>;
  depthMap: NodeMap<number>;
  loopMap: Map<NodeName, NodeName>;
  pairManager: PairManager;
  sccMap: [Map<NodeName, number>, Map<NodeName, number>];
  flow: number;

  constructor(graph: BipartiteDiGraph, flow: number) {
    const { graphs, typeMap, evenLoops, twoCycles, loopMap } = classify(
      graph,
      flow,
    );

    this.graphs = graphs;
    this.typeMap = typeMap;
    this.loopMap = loopMap;
    this.pairManager = PairManager.fromData(evenLoops, twoCycles);

    // depth 구하기

    this.depthMap = getDepthMap(this.graphs.getGraph("winlose"), this.typeMap);

    // Set all nodeDataValue.type that are undefined to "route"
    for (const pos of [0, 1] as const) {
      for (const node of this.graphs.getGraph("route").nodes(pos)) {
        if (!this.typeMap[pos].has(node)) {
          this.typeMap[pos].set(node, "route");
        } else {
          throw new Error("fucking error");
        }
      }
    }

    this.sccMap = this.graphs.getGraph("route").getSCCMap();
    this.flow = flow;
  }
  static fromObj(obj: GraphSolver): GraphSolver {
    const result: GraphSolver = Object.create(GraphSolver.prototype);
    const { graphs, typeMap, depthMap, sccMap, pairManager, loopMap, flow } =
      obj;
    Object.assign(result, {
      graphs: GraphPartitions.fromObj(graphs),
      pairManager: PairManager.fromObj(pairManager),
      typeMap,
      depthMap,
      loopMap,
      sccMap,
      flow,
    });

    return result;
  }

  getWinloseNodes(
    type: "win" | "lose" | "loopwin",
    view: NodePos,
  ): { depth: number; nodes: NodeName[] }[] {
    const result: { depth: number; nodes: NodeName[] }[] = [];
    const winloseNodes = Array.from(this.typeMap[view].entries())
      .filter(([, v]) => v === type)
      .map(([k]) => k);

    const temp: Map<number, string[]> = new Map();

    for (const node of winloseNodes) {
      const depth = this.depthMap[view].get(node)!;
      if (!temp.has(depth)) temp.set(depth, []);
      temp.get(depth)!.push(node);
    }

    for (const [depth, nodes] of temp.entries()) {
      nodes.sort();
      result.push({ depth: Number(depth), nodes });
    }
    result.sort((a, b) => a.depth - b.depth);

    return result;
  }
  getRouteNodes(pos: NodePos): RouteCharListData {
    // 1. getSCCMap()을 호출하여 현재 pos에 맞는 Map을 가져옵니다.
    // (만약 이미 클래스 내부에 캐싱되어 있다면 this.sccMap[pos] 형태로 바로 쓰셔도 됩니다)
    const sccMaps = this.sccMap;
    const currentSccMap = sccMaps[pos]; // Map<NodeName, number>

    // 2. 각 SCC ID별로 어떤 노드들이 속해있는지 모으기 위한 임시 맵을 만듭니다.
    // Key: SCC ID, Value: NodeName[]
    const sccGroups = new Map<number, NodeName[]>();

    for (const [node, sccId] of currentSccMap.entries()) {
      let group = sccGroups.get(sccId);
      if (!group) {
        group = [];
        sccGroups.set(sccId, group);
      }
      group.push(node);
    }

    // 3. 조건(길이가 3 미만인지 아닌지)에 따라 분류합니다.
    // result[0]: 길이가 3 이상인 컴포넌트의 노드들
    // result[1]: 길이가 3 미만인 컴포넌트의 노드들
    const result: [NodeName[], NodeName[]] = [[], []];

    for (const comp of sccGroups.values()) {
      // comp.length가 3보다 작으면 index 1, 크거나 같으면 index 0
      const index = Number(comp.length < 3);
      result[index].push(...comp);
    }

    // 4. 기존 로직 정렬 수행
    for (const e of result) {
      e.sort();
    }

    return result;
  }

  getNodeTypeNum(pos: NodePos) {
    const result: Record<NodeType, number> = {
      win: 0,
      lose: 0,
      route: 0,
      loopwin: 0,
    };
    for (const [, type] of this.typeMap[pos].entries()) {
      result[type]++;
    }

    return [
      { nodeType: "win", num: result.win, fill: "var(--color-win)" },
      { nodeType: "lose", num: result.lose, fill: "var(--color-lose)" },
      {
        nodeType: "loopwin",
        num: result.loopwin,
        fill: "var(--color-loopwin)",
      },
      { nodeType: "route", num: result.route, fill: "var(--color-route)" },
    ];
  }

  getWinloseDetailNumData(
    pos: NodePos,
  ): { depth: number; num: number; type: "win" | "lose"; fill: string }[] {
    const winloseNodes = Array.from(this.typeMap[pos].entries())
      .filter(([, v]) => normalizeNodeType(v) !== "route")
      .map(([k]) => k);

    const temp: Map<number, number> = new Map();

    for (const node of winloseNodes) {
      const depth = this.depthMap[pos].get(node)!;
      temp.set(depth, (temp.get(depth) ?? 0) + 1);
    }

    const result = Array.from(temp.entries())
      .map(([depth, num]) => {
        const depthNum = Number(depth);
        const type: "win" | "lose" = depthNum % 2 === 1 ? "win" : "lose";
        return {
          depth: depthNum,
          num,
          type: type,
          fill: `var(--color-${type})`,
        };
      })
      .sort((a, b) => a.depth - b.depth);
    return result;
  }

  getWinningOptimalMove(
    pos: NodePos,
    node: NodeName,
    changeFunc?: ChangeFunc,
  ): [NodeName, NodeName] {
    const nodeType = this.getNodeType(node, pos, changeFunc);

    if (nodeType !== "win" && nodeType !== "loopwin") {
      throw new Error(`(${pos}, ${node}) is not winning node`);
    }
    const graph = this.graphs.getGraph("winlose");
    if (pos === 1) {
      if (this.typeMap[1].get(node) === "loopwin") {
        return [node, this.loopMap.get(node)!];
      } else {
        const succ = graph
          .successors(1, node)
          .filter((e) => normalizeNodeType(this.typeMap[0].get(e)!) === "lose");

        return [
          node,
          succ.reduce((prev, curr) => {
            if (this.depthMap[0].get(prev)! < this.depthMap[0].get(curr)!) {
              return prev;
            } else {
              return curr;
            }
          }, succ[0]),
        ];
      }
    } else {
      if (graph.hasNode(0, node)) {
        const succ = graph
          .successors(0, node)
          .filter((e) => normalizeNodeType(this.typeMap[1].get(e)!) === "win");

        return this.getWinningOptimalMove(
          1,
          succ.reduce((prev, curr) => {
            if (this.depthMap[1].get(prev)! < this.depthMap[1].get(curr)!) {
              return prev;
            } else {
              return curr;
            }
          }, succ[0]),
          changeFunc,
        );
      } else {
        const moveViewNodes = this.graphs.getMoveViewNodes(
          pos,
          node,
          0,
          changeFunc,
        );

        return this.getWinningOptimalMove(
          1,
          moveViewNodes.reduce((prev, curr) => {
            if (this.depthMap[1].get(prev)! < this.depthMap[1].get(curr)!) {
              return prev;
            } else {
              return curr;
            }
          }, moveViewNodes[0]),
          changeFunc,
        );
      }
    }
  }
  getLosingOptimalMove(
    pos: NodePos,
    node: NodeName,
    changeFunc?: ChangeFunc,
  ): [NodeName, NodeName] | undefined {
    const graph = this.graphs.getGraph("winlose");
    if (pos === 1) {
      if (this.typeMap[1].has(node)) {
        if (
          this.depthMap[1].get(node) === 0 ||
          this.depthMap[1].get(node) === 1
        ) {
          return undefined;
        } else {
          const succ = graph
            .successors(1, node)
            .filter((s) => s !== this.loopMap.get(node));

          return [
            node,
            succ.reduce((prev, curr) => {
              if (this.depthMap[0].get(prev)! > this.depthMap[0].get(curr)!) {
                return prev;
              } else {
                return curr;
              }
            }, succ[0]),
          ];
        }
      } else return undefined;
    } else {
      if (this.typeMap[0].has(node)) {
        const succ = graph.successors(0, node);
        return this.getLosingOptimalMove(
          1,
          succ.reduce((prev, curr) => {
            if (this.depthMap[0].get(prev)! > this.depthMap[0].get(curr)!) {
              return prev;
            } else {
              return curr;
            }
          }, succ[0]),
          changeFunc,
        );
      } else {
        const moveViewNodes = this.graphs.getMoveViewNodes(
          pos,
          node,
          0,
          changeFunc,
        );
        if (moveViewNodes.length === 0) {
          return undefined;
        }
        return this.getLosingOptimalMove(
          1,
          moveViewNodes.reduce((prev, curr) => {
            if (this.depthMap[1].get(prev)! < this.depthMap[1].get(curr)!) {
              return prev;
            } else {
              return curr;
            }
          }, moveViewNodes[0]),
          changeFunc,
        );
      }
    }
  }

  getNodeType(node: string, pos: 0 | 1, changeFunc?: ChangeFunc): NodeType {
    if (this.typeMap[pos].has(node)) {
      return this.typeMap[pos].get(node)!;
    }

    const nodes = this.graphs.getMoveViewNodes(pos, node, 0, changeFunc);

    const nextTypes = nodes.map((e) => this.typeMap[1].get(e)!);

    if (nextTypes.some((e) => e === "win" || e === "loopwin")) {
      return "win";
    } else if (nextTypes.some((e) => e === "route")) {
      return "route";
    } else {
      return "lose";
    }
  }

  classifyMoves(moveMap: EdgeMap<number[]>): MoveClass {
    const moveClass: MoveClass = range(6).map(() => []);

    for (const [head, tail, idxArr] of moveMap.toArray()) {
      const headType = this.typeMap[1].get(head);
      const tailType = this.typeMap[0].get(tail);
      for (const idx of idxArr) {
        const { type, depth, pair, connected } = this.getMoveType(
          head,
          tail,
          idx,
        );

        const moveInfo = moveClass[type];

        const moveInfoMap = (moveInfo[
          depth ?? (connected === undefined ? 0 : 1 - Number(connected))
        ] ??= new EdgeMap<{
          nodeTypes: [NodeType, NodeType];
          wordIdx: number[];
          pairs: [NodeName, NodeName, number][];
        }>());

        const info = moveInfoMap.get(head, tail, {
          nodeTypes: [headType, tailType],
          wordIdx: [],
          pairs: [],
        });
        info.wordIdx.push(idx);
        if (pair) {
          info.pairs.push(pair);
        }
      }
    }
    return moveClass;
  }
  // WordSolver 클래스 내부 메서드
  getSccData(
    pos: NodePos,
    asc: boolean,
  ): {
    nodes: NodeName[];
    succ: { nodes: NodeName[]; by: [NodeName, NodeName, [number, number]][] }[];
  }[] {
    const routeGraph = this.graphs.getGraph("route");

    // 💡 routeGraph가 BipartiteDiGraph 인스턴스이므로, 여기에 this.sccMap을 주입합니다.
    const [G, , members] = routeGraph.condensation(this.sccMap, pos);

    const oppos: NodePos = (1 - pos) as NodePos;

    // 2단계 탐색 최적화 헬퍼 함수 (기존과 동일)
    const getTwoStepCount = (node: NodeName, isSuccessor: boolean): number => {
      let count = 0;
      const firstStep = isSuccessor
        ? routeGraph.successors(pos, node)
        : routeGraph.predecessors(pos, node);

      const len = firstStep.length;
      for (let i = 0; i < len; i++) {
        const nextNode = firstStep[i];
        const secondStep = isSuccessor
          ? routeGraph.successors(oppos, nextNode)
          : routeGraph.predecessors(oppos, nextNode);
        count += secondStep.length;
      }
      return count;
    };

    for (const member of members) {
      if (!member) continue;
      member.sort((prev, curr) => {
        const prevTotal =
          getTwoStepCount(prev, true) + getTwoStepCount(prev, false);
        const currTotal =
          getTwoStepCount(curr, true) + getTwoStepCount(curr, false);

        return prevTotal > currTotal ? -1 : 1;
      });
    }

    const result: ReturnType<typeof this.getSccData> = [];
    const nodes = G.sortByDistanceFromSink();
    if (asc) {
      nodes.reverse();
    }

    for (const index of nodes) {
      const nextIndices = G.successors(index);
      const data = {
        nodes: members[index],
        succ: nextIndices.map((e) => {
          return {
            nodes: members[e],
            by: G.getProp(index, e)!
              .edges.toArray()
              .map(
                ([start, end]) =>
                  [
                    start,
                    end,
                    this.graphs.getEdgeIdxRange(start, end, "route"),
                  ] as [string, string, [number, number]],
              ),
          };
        }),
      };
      result.push(data);
    }

    return result;
  }
  getComparisonMap(
    solver: GraphSolver,
    changeFunc: ChangeFunc,
  ): [
    Map<NodeName, [NodeType, NodeType]>,
    Map<NodeName, [NodeType, NodeType]>,
  ] {
    const result: [
      Map<NodeName, [NodeType, NodeType]>,
      Map<NodeName, [NodeType, NodeType]>,
    ] = [new Map(), new Map()];

    const nodes = [0, 1].map((pos) =>
      Array.from(
        new Set([...this.typeMap[pos].keys(), ...solver.typeMap[pos].keys()]),
      ),
    );

    for (const pos of [0, 1] as NodePos[]) {
      for (const node of nodes[pos]) {
        const before = this.getNodeType(node, pos, changeFunc);
        const after = solver.getNodeType(node, pos, changeFunc);
        if (before !== after) {
          result[pos].set(node, [before, after]);
        }
      }
    }

    return result;
  }
  getChangeablesCharsData(
    node: NodeName,
    changeFunc: ChangeFunc,
  ): {
    from: [NodeName, NodeType][];
    to: [NodeName, NodeType][];
  } {
    const backwardChars = changeFunc.backward(node);
    const forwardChars = changeFunc.forward(node);
    return {
      from: backwardChars.map((e) => [e, this.getNodeType(e, 0, changeFunc)]),
      to: forwardChars.map((e) => [e, this.getNodeType(e, 1, changeFunc)]),
    };
  }

  getMaxRouteInfo(view: NodePos) {
    // 1. 각 SCC ID별 전체 노드 개수 집계 (pos 0과 pos 1의 합산)
    const sccTotalCounts = new Map<number, number>();

    for (const sccId of this.sccMap[0].values()) {
      sccTotalCounts.set(sccId, (sccTotalCounts.get(sccId) || 0) + 1);
    }
    for (const sccId of this.sccMap[1].values()) {
      sccTotalCounts.set(sccId, (sccTotalCounts.get(sccId) || 0) + 1);
    }

    // 2. 총 크기가 3 이상인 SCC에 속한 노드들만 추출하여 유도 부분 그래프(Induced Subgraph) 대상 생성
    const maxNodes: [Set<NodeName>, Set<NodeName>] = [new Set(), new Set()];

    for (const [node, sccId] of this.sccMap[0].entries()) {
      if ((sccTotalCounts.get(sccId) || 0) >= 3) {
        maxNodes[0].add(node);
      }
    }
    for (const [node, sccId] of this.sccMap[1].entries()) {
      if ((sccTotalCounts.get(sccId) || 0) >= 3) {
        maxNodes[1].add(node);
      }
    }

    // 유도 부분 그래프 생성
    const maxGraph = this.graphs.getGraph("route").getInducedSubgraph(maxNodes);

    const charNum = maxGraph.nodes(view).length;

    // 3. reduce 제거하고 단순 루프로 엣지 총합 계산 (가비지 컬렉션 최적화)
    const maxEdges = maxGraph.edges(1);
    let moveNum = 0;
    for (let i = 0; i < maxEdges.length; i++) {
      moveNum += maxEdges[i][2];
    }

    let averageNum = 0;
    const nodes1 = maxGraph.nodes(1);

    if (view === 0) {
      for (let i = 0; i < nodes1.length; i++) {
        const node1 = nodes1[i];
        const successors = maxGraph.successors(1, node1);

        let outDeg = 0;
        for (let j = 0; j < successors.length; j++) {
          outDeg += maxGraph.getEdgeNum(node1, successors[j]);
        }

        const inDeg = maxGraph.inDegree(1, node1);
        averageNum += inDeg * outDeg;
      }
    } else {
      for (let i = 0; i < nodes1.length; i++) {
        const node1 = nodes1[i];
        const successors = maxGraph.successors(1, node1);

        let outDeg = 0;
        for (let j = 0; j < successors.length; j++) {
          outDeg += maxGraph.getEdgeNum(node1, successors[j]);
        }

        averageNum += outDeg;
      }
    }

    // 0으로 나누는 런타임 에러 방지 방어 코드 추가
    if (charNum > 0) {
      averageNum /= charNum;
    } else {
      averageNum = 0;
    }

    averageNum = round(averageNum, 3);

    return { charNum, moveNum, averageNum };
  }
  getWordTypeNum(): {
    typeNum: number[];
    subtypeNum: [NodeType, NodeType, number][][];
  } {
    const typeNum: number[] = [0, 0, 0, 0, 0, 0];

    const removed = this.graphs
      .getGraph("removed")
      .edges(1)
      .reduce((prev, curr) => prev + curr[2], 0);
    typeNum[2] = removed;
    const edges = [
      ...this.graphs.getGraph("route").edges(1),
      ...this.graphs.getGraph("winlose").edges(1),
    ];
    const typeCounter: Record<NodeType, Record<NodeType, number>>[] =
      moveTypeToNodeTypes.map((e) => toNestedRecord(e));

    for (const [start, end, num] of edges) {
      const startType = this.getNodeType(start, 1);
      const endType = this.getNodeType(end, 0);

      const { type: moveType } = this.getUnremovedMoveType(start, end);
      typeNum[moveType] += num;
      typeCounter[moveType][startType][endType] += num;
    }

    const subtypeNum = moveTypeToNodeTypes.map((subTypes, moveType) =>
      subTypes.map(
        (nodeTypes) =>
          [...nodeTypes, typeCounter[moveType][nodeTypes[0]][nodeTypes[1]]] as [
            NodeType,
            NodeType,
            number,
          ],
      ),
    );

    return { typeNum, subtypeNum };
  }
  getUnremovedMoveType(
    start: NodeName,
    end: NodeName,
  ): { type: MoveType; depth?: number; connected?: boolean } {
    const headType = this.typeMap[1].get(start)!;
    const tailType = this.typeMap[0].get(end)!;
    if (headType === "loopwin" && tailType === "loopwin") {
      if (this.loopMap.get(start) === end) {
        return { type: 0, depth: this.depthMap[0].get(end)! };
      } else {
        return { type: 5, depth: this.depthMap[0].get(end)! + 1 };
      }
    }
    const moveType: MoveType = nodeTypesToMoveType[headType][
      tailType
    ] as MoveType;
    if (hasDepthMap[moveType]) {
      return {
        type: moveType,
        depth: this.depthMap[0].get(end)! + 1,
      };
    } else if (moveType === 1) {
      const endSccId = this.sccMap[0].get(end); // pos: 0 (end)
      const startSccId = this.sccMap[1].get(start); // pos: 1 (start)

      // 두 노드 모두 SCC ID가 존재하고, 그 ID가 서로 일치하는지 O(1)로 비교합니다.
      const connected =
        startSccId !== undefined &&
        endSccId !== undefined &&
        startSccId === endSccId;
      return { type: moveType, connected };
    } else {
      return { type: moveType };
    }
  }
  getMoveType(
    start: NodeName,
    end: NodeName,
    idx: number,
  ): {
    type: MoveType;
    pair?: [NodeName, NodeName, number];
    depth?: number;
    connected?: boolean;
  } {
    if (idx < this.graphs.getGraph("removed").getEdgeNum(start, end)) {
      return { type: 2, pair: this.pairManager.getPairIdx(start, end, idx) };
    } else {
      return this.getUnremovedMoveType(start, end);
    }
  }

  getDistributionMap(
    type: NodeType,
    view: NodePos,
    direction: 0 | 1,
  ): Map<NodeName, [number, number, number, number, number, number]> {
    const removedEdges = this.graphs.getGraph("removed").edges(1);
    const unremovedEdges = [
      ...this.graphs.getGraph("route").edges(1),
      ...this.graphs.getGraph("winlose").edges(1),
    ];
    const nodeMap = new Map<
      NodeName,
      [number, number, number, number, number, number]
    >();
    const oppos = getOppos(view);

    for (const [node, nodeType] of this.typeMap[view].entries()) {
      if (type === nodeType) {
        nodeMap.set(node, [0, 0, 0, 0, 0, 0]);
      }
    }

    for (const e of removedEdges) {
      if ((direction ^ view) === 1) {
        if (!nodeMap.has(e[direction])) continue;
        nodeMap.get(e[direction])![2] += e[2];
      } else {
        const targets =
          direction === 0
            ? this.graphs.predecessors(oppos, e[direction])
            : this.graphs.successors(oppos, e[direction]);
        for (const node of targets) {
          if (!nodeMap.has(node)) continue;
          nodeMap.get(node)![2] += e[2];
        }
      }
    }

    for (const e of unremovedEdges) {
      const { type: moveType } = this.getUnremovedMoveType(e[0], e[1]);
      if ((direction ^ view) === 1) {
        if (!nodeMap.has(e[direction])) continue;
        nodeMap.get(e[direction])![moveType] += e[2];
      } else {
        const targets =
          direction === 0
            ? this.graphs.predecessors(oppos, e[direction])
            : this.graphs.successors(oppos, e[direction]);
        for (const node of targets) {
          if (!nodeMap.has(node)) continue;
          nodeMap.get(node)![moveType] += e[2];
        }
      }
    }

    return nodeMap;
  }
  getDistribution(
    type: NodeType,
    view: NodePos,
    direction: 0 | 1,
    sort: { key: "total" | MoveType; desc: boolean },
    displayType: "number" | "fraction", // 👈 기본값 추가
  ): {
    char: string;
    num: [number, number, number, number, number, number];
  }[] {
    let result = Array.from(
      this.getDistributionMap(type, view, direction).entries(),
    ).map(([nodeName, num]) => ({ char: nodeName, num }));
    // ✅ 비율로 보기 처리
    if (displayType === "fraction") {
      result = result.map(({ char, num }) => {
        const total = num.reduce((a, b) => a + b, 0);
        return {
          char,
          num:
            total === 0
              ? (num.map(() => 0) as typeof num)
              : (num.map((n) => n / total) as typeof num),
        };
      });
    }

    // ✅ 정렬
    result.sort((a, b) => {
      const getValue = (x: typeof a) =>
        sort.key === "total"
          ? x.num.reduce((a, b) => a + b, 0)
          : x.num[sort.key];

      return getValue(a) - getValue(b);
    });

    if (sort.desc) result.reverse();

    return result;
  }
  getDistributionWithCalc(
    type: NodeType,
    view: NodePos,
    wordTypes: [MoveType | "total", MoveType | "total"],
    desc: boolean,
    calcType: "ratio" | "difference",
  ): { char: NodeName; num: [number, number, number] }[] {
    const distributionMaps: Map<NodeName, number>[] = ([0, 1] as (0 | 1)[]).map(
      (direction) => {
        const dMap = this.getDistributionMap(type, view, direction as 0 | 1);
        const result = new Map<NodeName, number>();
        for (const [node, val] of dMap.entries()) {
          const t = wordTypes[direction];
          if (t === "total") {
            result.set(node, sum(val));
          } else {
            result.set(node, val[t]);
          }
        }
        return result;
      },
    );
    const nodes = Array.from(distributionMaps[0].keys());
    const result: {
      char: NodeName;
      num: [number, number, number];
    }[] = [];
    for (const node of nodes) {
      result.push({
        char: node,
        num: [
          distributionMaps[1].get(node)!,
          distributionMaps[0].get(node)!,
          calcType === "ratio"
            ? distributionMaps[1].get(node)! / distributionMaps[0].get(node)!
            : distributionMaps[1].get(node)! - distributionMaps[0].get(node)!,
        ],
      });
    }
    result.sort((a, b) => a.num[2] - b.num[2]);
    if (desc === true) {
      result.reverse();
    }

    return result;
  }
}

export function sortEdges(edges: string[][] | [string, string, number][]) {
  return edges.sort(
    (a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]),
  );
}

export function normalizeNodeType(type: NodeType): NormalizedNodeType {
  if (type === "loopwin") {
    return "win";
  }
  return type;
}

export function getComparisonData(
  mapping: ComparisonMap,
): [ComparisonData, ComparisonData] {
  const result: [ComparisonData, ComparisonData] = [[], []];
  const temp: [EdgeMap<NodeName[]>, EdgeMap<NodeName[]>] = [
    new EdgeMap(),
    new EdgeMap(),
  ];

  for (const pos of [0, 1] as NodePos[]) {
    for (const [node, [before, after]] of mapping[pos].entries()) {
      temp[pos].get(before, after, []).push(node);
    }
    for (const before of ["win", "lose", "loopwin", "route"] as NodeType[]) {
      for (const after of ["win", "lose", "loopwin", "route"] as NodeType[]) {
        if (before !== after)
          result[pos].push([before, after, temp[pos].get(before, after, [])]);
      }
    }
  }
  return result;
}
