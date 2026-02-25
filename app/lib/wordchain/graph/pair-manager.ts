import { EdgeCounter } from "../classes/edge-counter";
import { EdgeMap } from "../classes/edge-map";
import type { NodeName } from "./graph";

export class PairManager {
  evenLoopMap: EdgeCounter;
  twoCycleMap: EdgeMap<[NodeName, NodeName, number][]>;
  constructor() {
    this.evenLoopMap = new EdgeCounter();
    this.twoCycleMap = new EdgeMap();
  }

  static fromObj(obj: PairManager) {
    const result = Object.create(PairManager.prototype);
    const { evenLoopMap, twoCycleMap } = obj;
    Object.assign(result, {
      evenLoopMap: EdgeMap.fromObj(evenLoopMap),
      twoCycleMap: EdgeMap.fromObj(twoCycleMap),
    });
    return result;
  }

  static fromData(
    evenLoops: [NodeName, NodeName, number][],
    twoCycles: [[NodeName, NodeName], [NodeName, NodeName], number][],
  ) {
    const result = new PairManager();
    evenLoops.map((e) => result.addEvenLoop(e));
    twoCycles.map((e) => result.addTwoCycle(e));
    return result;
  }

  addEvenLoop(evenLoop: [NodeName, NodeName, number]) {
    const [start, end, num] = evenLoop;
    if (num > 0) {
      this.evenLoopMap.increase(start, end, num);
    }
  }
  addTwoCycle(twoCycle: [[NodeName, NodeName], [NodeName, NodeName], number]) {
    const [[start1, end1], [start2, end2], num] = twoCycle;
    if (num > 0) {
      this.twoCycleMap.get(start1, end1, []).push([start2, end2, num]);
      this.twoCycleMap.get(start2, end2, []).push([start1, end1, num]);
    }
  }
  getEvenLoopNum(head: NodeName, tail: NodeName): number {
    return this.evenLoopMap.get(head, tail) ?? 0;
  }
  getTwoCyclesNum(head: NodeName, tail: NodeName): number {
    return (this.twoCycleMap.get(head, tail) || []).reduce(
      (prev, curr) => prev + curr[2],
      0,
    );
  }
  getRemovedWordNum(head: NodeName, tail: NodeName): number {
    return this.getEvenLoopNum(head, tail) + this.getTwoCyclesNum(head, tail);
  }
  getPairIdx(
    head: NodeName,
    tail: NodeName,
    idx: number,
  ): [NodeName, NodeName, number] | undefined {
    const evenLoopNum = this.getEvenLoopNum(head, tail);

    if (idx < evenLoopNum) {
      return [head, tail, (idx + Math.floor(evenLoopNum / 2)) % evenLoopNum];
    } else {
      idx -= evenLoopNum;
      const pairs = this.twoCycleMap.get(head, tail) || [];
      for (const [pairHead, pairTail, num] of pairs) {
        if (idx < num) {
          return [pairHead, pairTail, idx];
        }
        idx -= num;
      }
      return undefined;
    }
  }
  isRemoved(head: NodeName, tail: NodeName, idx: number): boolean {
    return idx < this.getRemovedWordNum(head, tail);
  }
}
