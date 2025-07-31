export class DiGraph<T extends string | number, Prop> {
  private _succ: Map<T, Set<T>>;
  private _pred: Map<T, Set<T>>;
  private _prop: Map<T, Map<T, Prop>>;

  constructor() {
    this._succ = new Map();
    this._pred = new Map();
    this._prop = new Map();
  }

  nodes(): T[] {
    return [...this._succ.keys()];
  }

  edges(): [T, T][] {
    const result: [T, T][] = [];
    for (const [start, succSet] of this._succ.entries()) {
      for (const end of succSet) {
        result.push([start, end]);
      }
    }
    return result;
  }

  hasNode(node: T): boolean {
    return this._succ.has(node);
  }

  addNode(node: T): void {
    if (!this._succ.has(node)) {
      this._succ.set(node, new Set());
      this._pred.set(node, new Set());
      this._prop.set(node, new Map());
    }
  }

  hasEdge(start: T, end: T): boolean {
    return this._succ.get(start)?.has(end) ?? false;
  }

  addEdge(start: T, end: T, prop: Prop): void {
    this.addNode(start);
    this.addNode(end);

    this._succ.get(start)!.add(end);
    this._pred.get(end)!.add(start);
    this._prop.get(start)!.set(end, prop);
  }

  getProp(start: T, end: T): Prop | undefined {
    return this._prop.get(start)?.get(end);
  }

  successors(node: T): T[] {
    return [...(this._succ.get(node) ?? [])];
  }

  predecessor(node: T): T[] {
    return [...(this._pred.get(node) ?? [])];
  }
  sortByDistanceFromSink(): T[] {
    const dist = new Map<T, number>();
    const inDegree = new Map<T, number>();
    const reversedGraph = new Map<T, T[]>();

    // 역방향 그래프 구성 및 역 in-degree 계산
    for (const node of this.nodes()) {
      dist.set(node, 0); // 초기화
      for (const pred of this._pred.get(node) ?? []) {
        if (!reversedGraph.has(node)) reversedGraph.set(node, []);
        reversedGraph.get(node)!.push(pred);
        inDegree.set(pred, (inDegree.get(pred) ?? 0) + 1);
      }
    }

    // 큐 초기화: sink 노드들이 역방향 그래프에서 source 역할을 함
    const queue: T[] = [];
    for (const node of this.nodes()) {
      if (!inDegree.has(node)) {
        queue.push(node);
      }
    }

    // 위상 정렬 기반 DP
    while (queue.length > 0) {
      const u = queue.shift()!;
      const d = dist.get(u)!;
      for (const v of reversedGraph.get(u) ?? []) {
        dist.set(v, Math.max(dist.get(v)!, d + 1));
        inDegree.set(v, inDegree.get(v)! - 1);
        if (inDegree.get(v)! === 0) {
          queue.push(v);
        }
      }
    }

    // 거리 기준으로 내림차순 정렬
    return this.nodes().sort((a, b) => dist.get(b)! - dist.get(a)!);
  }
}
