// export class DiGraph {
//   _succ: Record<string, Set<string>>;
//   _pred: Record<string, Set<string>>;
//   nodes: Set<string>;
//   constructor() {
//     this._succ = {};
//     this._pred = {};
//     this.nodes = new Set();
//   }
//   addEdge(start: string, end: string) {
//     this.nodes.add(start).add(end);
//     if (!this.nodes.has(start)) {
//       this._succ[start] = new Set();
//       this._pred[start] = new Set();
//     }
//     if (!this.nodes.has(end)) {
//       this._succ[end] = new Set();
//       this._pred[end] = new Set();
//     }
//     this._succ[start].add(end)
//     this._pred[end].add(start)
//   }
// }

export class MultiDiGraph {
  _succ: Record<string, Record<string, number>>;
  _pred: Record<string, Record<string, number>>;
  nodes: Record<string, Record<string, unknown>>;
  constructor() {
    this._succ = {};
    this._pred = {};
    this.nodes = {};
  }

  addEdge(start: string, end: string, num: number = 1) {
    this.nodes[start] = {};
    this.nodes[end] = {};

    if (!this._succ[start]) {
      this._succ[start] = {};
      this._pred[start] = {};
    }
    if (!this._succ[end]) {
      this._succ[end] = {};
      this._pred[end] = {};
    }
    if (!this._succ[start][end]) {
      this._succ[start][end] = 0;
    }
    if (!this._pred[end][start]) {
      this._pred[end][start] = 0;
    }
    this._succ[start][end] += num;
    this._pred[end][start] += num;
  }

  predecessors(node: string | string[]) {
    if (typeof node === "string") {
      if (!this._pred[node]) {
        console.log(node);
      }
      return Object.keys(this._pred[node]);
    } else {
      return [
        ...new Set(
          node.flatMap((n) => {
            return Object.keys(this._pred[n]);
          })
        ),
      ];
    }
  }

  successors(node: string | string[]) {
    if (typeof node === "string") {
      if (!this._succ[node]) {
        throw `${node} not in graph`;
      }
      return Object.keys(this._succ[node]);
    } else {
      return [...new Set(node.flatMap((n) => Object.keys(this._succ[n])))];
    }
  }
  removeNode(node: string | string[]) {
    if (typeof node === "string") {
      node = [node];
    }
    for (let n of node) {
      for (let succ in this._succ[n]) {
        delete this._pred[succ][n];
      }
      delete this._succ[n];
      for (let pred in this._pred[n]) {
        delete this._succ[pred][n];
      }
      delete this._pred[n];
      delete this.nodes[n];
    }
  }

  removeEdgeBunch(start: string, end: string) {
    delete this._succ[start][end];
    delete this._pred[end][start];
  }

  removeInEdge(node: string | string[]) {
    if (typeof node === "string") {
      node = [node];
    }
    for (let n of node) {
      for (let pred in this._pred[n]) {
        delete this._succ[pred][n];
      }
      if (!this._pred[n]) {
        console.log(this._pred);
        console.log(n);
      }
      Object.keys(this._pred[n]).forEach((key) => {
        delete this._pred[n][key];
      });
    }
  }
  removeOutEdge(node: string | string[]) {
    if (typeof node === "string") {
      node = [node];
    }
    for (let n of node) {
      for (let succ in this._succ[n]) {
        delete this._pred[succ][n];
      }
      Object.keys(this._succ[n]).forEach((key) => {
        delete this._succ[n][key];
      });
    }
  }
  removeEdge(start: string, end: string, num: number = 1) {
    this._succ[start][end] -= num;
    if (this._succ[start][end] <= 0) {
      delete this._succ[start][end];
    }
    this._pred[end][start] -= num;
    if (this._pred[end][start] <= 0) {
      delete this._pred[end][start];
    }
  }
  hasEdge(start: string, end: string) {
    if (!this._succ[start]) {
      return false;
    }
    if (!this._succ[start][end]) {
      return false;
    }
    return true;
  }
  getSize() {
    let sum = 0;
    for (let char in this._succ) {
      sum += Object.values(this._succ[char]).reduce(
        (acc, prev) => acc + prev,
        0
      );
    }
    return sum;
  }
}
export function objToMultiDiGraph(obj: MultiDiGraph): MultiDiGraph {
  const result = new MultiDiGraph();
  result._pred = obj._pred;
  result._succ = obj._succ;
  result.nodes = obj.nodes;
  return result;
}
