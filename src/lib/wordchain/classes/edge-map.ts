import type { NodeName } from "../graph/graph";

export class EdgeMap<T> {
  content: Map<NodeName, Map<NodeName, T>>;

  constructor() {
    this.content = new Map();
  }

  static fromObj<T>(obj: EdgeMap<T>): EdgeMap<T> {
    const result = new EdgeMap<T>();
    for (const [start, innerMap] of obj.content.entries()) {
      result.content.set(start, new Map(innerMap));
    }
    return result;
  }

  static fromArray<T>(arr: [NodeName, NodeName, T][]): EdgeMap<T> {
    const result = new EdgeMap<T>();
    for (const [start, end, value] of arr) {
      result.set(start, end, value);
    }
    return result;
  }

  toObject(): Record<NodeName, Record<NodeName, T>> {
    const result: Record<NodeName, Record<NodeName, T>> = {};
    for (const [start, inner] of this.content.entries()) {
      result[start] = Object.fromEntries(inner.entries());
    }
    return result;
  }

  set(start: NodeName, end: NodeName, value: T) {
    if (!this.content.has(start)) {
      this.content.set(start, new Map());
    }
    this.content.get(start)!.set(end, value);
  }

  get(start: NodeName, end: NodeName): T | undefined;
  get(start: NodeName, end: NodeName, defaultValue: T): T;
  get(start: NodeName, end: NodeName, defaultValue?: T): T | undefined {
    const inner = this.content.get(start);
    if (inner && inner.has(end)) {
      return inner.get(end);
    }
    if (defaultValue !== undefined) {
      this.set(start, end, defaultValue);
      return defaultValue;
    }
    return undefined;
  }

  remove(start: NodeName, end?: NodeName) {
    if (end !== undefined) {
      const inner = this.content.get(start);
      if (inner) {
        inner.delete(end);
        if (inner.size === 0) {
          this.content.delete(start);
        }
      }
    } else {
      this.content.delete(start);
    }
  }

  toArray(): [NodeName, NodeName, T][] {
    const result: [NodeName, NodeName, T][] = [];
    for (const [start, inner] of this.content.entries()) {
      for (const [end, value] of inner.entries()) {
        result.push([start, end, value]);
      }
    }
    return result;
  }

  getSucc(node: NodeName): [NodeName, T][] {
    return [...(this.content.get(node)?.entries() ?? [])];
  }
}
