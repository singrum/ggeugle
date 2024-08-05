export class MultiDiGraph {
  _succ: Record<string, Record<string, number>>;
  _pred: Record<string, Record<string, number>>;
  nodes: Set<string>;
  constructor() {
    this._succ = {};
    this._pred = {};
    this.nodes = new Set();
  }

  addEdge(start: string, end: string, num: number = 1) {
    this.nodes.add(start).add(end);

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
      return Object.keys(this._pred[node]);
    } else {
      return [...new Set(node.flatMap((n) => Object.keys(this._pred[n])))];
    }
  }

  successors(node: string | string[]) {
    if (typeof node === "string") {
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
      this.nodes.delete(n);
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
      Object.keys(this._pred[n]).forEach((key) => {
        delete this._pred[n][key];
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
