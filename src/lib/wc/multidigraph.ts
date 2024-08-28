import { cloneDeep } from "lodash";
import { arrayToKeyMap } from "../utils";

export class WordMap {
  _succ: Record<string, Record<string, string[]>>;
  _pred: Record<string, Record<string, string[]>>;

  constructor() {
    this._succ = {};
    this._pred = {};
  }

  addWord(start: string, end: string, word: string) {
    if (!this._succ[start]) {
      this._succ[start] = {};
      this._pred[start] = {};
    }
    if (!this._succ[end]) {
      this._succ[end] = {};
      this._pred[end] = {};
    }
    if (!this._succ[start][end]) {
      this._succ[start][end] = [];
    }
    if (!this._pred[end][start]) {
      this._pred[end][start] = [];
    }
    this._succ[start][end].push(word);
    this._pred[end][start].push(word);
  }
  removeWord(start: string, end: string, word: string) {
    this._succ[start][end] = this._succ[start][end].filter((e) => e !== word);
    this._pred[end][start] = this._succ[end][start].filter((e) => e !== word);
    if (this._succ[start][end].length === 0) {
      delete this._succ[start][end];
    }
    if (this._pred[end][start].length === 0) {
      delete this._pred[end][start];
    }
  }
  hasEdge(start: string, end: string) {
    if (!this._succ[start]) {
      return false;
    } else if (!this._succ[start][end]) {
      return false;
    } else {
      return true;
    }
  }
  select(start: string, end: string) {
    return this._succ[start][end];
  }

  outWords(start: string) {
    return Object.values(this._succ[start] || {}).flat();
  }
  inWords(end: string) {
    return Object.values(this._pred[end] || {}).flat();
  }
}

export class MultiDiGraph {
  _succ: Record<string, Record<string, number>>;
  _pred: Record<string, Record<string, number>>;
  nodes: Record<string, Record<string, unknown>>;
  constructor() {
    this._succ = {};
    this._pred = {};
    this.nodes = {};
  }
  edges() {
    return Object.keys(this.nodes).flatMap((node) =>
      Object.keys(this._succ[node]).map((tail) => [node, tail])
    );
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
  addNode(node: string | string[]) {
    if (typeof node === "string") {
      node = [node];
    }
    node.forEach((n) => {
      if (!this.nodes[n]) {
        this.nodes[n] = {};
        if (!this._succ[n]) {
          this._succ[n] = {};
          this._pred[n] = {};
        }
      }
    });
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

  forEachPreds(
    nodes: string | string[],
    callback: (node: string, pred: string, num: number) => void
  ) {
    if (typeof nodes === "string") {
      nodes = [nodes];
    }
    const visited = new Set();
    for (let node of nodes) {
      for (let pred in this._pred[node]) {
        if (visited.has(pred)) {
          continue;
        }
        visited.add(pred);
        callback(node, pred, this._pred[node][pred]);
      }
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

    sum += Object.keys(this.nodes).filter((e) => this.nodes[e].loop).length;

    return sum;
  }
  copy() {
    const result = new MultiDiGraph();
    result._pred = cloneDeep(this._pred);
    result._succ = cloneDeep(this._succ);
    result.nodes = { ...this.nodes };
    return result;
  }
  getSubgraph(nodes: Set<string>) {
    const result = new MultiDiGraph();
    for (let node of nodes) {
      result.nodes[node] = this.nodes[node];

      result._pred[node] = arrayToKeyMap(
        Object.keys(this._pred[node]).filter((e) => nodes.has(e)),
        (e) => this._pred[node][e]
      );
      result._succ[node] = arrayToKeyMap(
        Object.keys(this._succ[node]).filter((e) => nodes.has(e)),
        (e) => this._succ[node][e]
      );
    }
    return result;
  }
  clearNodeInfo() {
    for (let node in this.nodes) {
      if (this.nodes[node].loop) {
        this.addEdge(node, this.nodes[node].loop as string);
      }
    }
    for (let node in this.nodes) {
      this.nodes[node] = {};
    }
  }
}

export function objToMultiDiGraph(obj: MultiDiGraph): MultiDiGraph {
  const result = new MultiDiGraph();
  result._pred = obj._pred;
  result._succ = obj._succ;
  result.nodes = obj.nodes;
  return result;
}
export function ObjToWordMap(obj: WordMap): WordMap {
  const result = new WordMap();
  result._pred = obj._pred;
  result._succ = obj._succ;
  return result;
}
