import type { NodeName } from "../graph/graph";
import { EdgeMap } from "./edge-map";

export class EdgeCounter extends EdgeMap<number> {
  static fromEdgeCounter(obj: EdgeCounter): EdgeCounter {
    const result = new EdgeCounter();
    result.content = obj.content;
    return result;
  }
  static fromEdgeMap(edgeMap: EdgeMap<number>) {
    const result = new EdgeCounter();
    result.content = edgeMap.content;
    return result;
  }
  get(start: NodeName, end: NodeName, num?: number | undefined): number {
    if (num === undefined) {
      return super.get(start, end) ?? 0;
    } else {
      return super.get(start, end, num) ?? 0;
    }
  }
  increase(start: NodeName, end: NodeName, amount: number = 1) {
    const current = this.get(start, end);
    this.set(start, end, current + amount);
  }

  decrease(start: NodeName, end: NodeName, amount: number = 1) {
    const current = this.get(start, end);
    const next = current - amount;
    if (next > 0) {
      this.set(start, end, next);
    } else if (next === 0) {
      this.remove(start, end);
    } else {
      throw new Error("cannot decrease edge to less than zero");
    }
  }
}
