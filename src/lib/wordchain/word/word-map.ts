import { getHeadTail } from "@/lib/utils";
import { EdgeMap } from "../classes/edge-map";
import type { NodeName } from "../graph/graph";

export class WordMap extends EdgeMap<string[]> {
  static fromWordMap(obj: WordMap): WordMap {
    const result = new WordMap();
    result.content = obj.content;
    return result;
  }
  static fromWords(words: string[], headIdx: number, tailIdx: number): WordMap {
    const result = new WordMap();
    for (const word of words) {
      result.addWord(word, headIdx, tailIdx);
    }
    return result;
  }

  removeWord(head: NodeName, tail: NodeName, word: string) {
    const arr = this.get(head, tail);
    if (!arr) {
      return;
    }
    const index = arr.indexOf(word);
    if (index !== -1) arr.splice(index, 1);
    if (arr.length === 0) {
      this.remove(head, tail);
    }
  }
  copy() {
    const result = new WordMap();
    for (const [start, end, arr] of this.toArray()) {
      result.set(start, end, [...arr]);
    }
    return result;
  }

  addWord(word: string, headIdx: number, tailIdx: number) {
    const [head, tail] = getHeadTail(word, headIdx, tailIdx);
    this.get(head, tail, []).push(word);
  }

  getMove(
    word: string,
    headIdx: number,
    tailIdx: number,
  ): [NodeName, NodeName, number] | undefined {
    const [head, tail] = getHeadTail(word, headIdx, tailIdx);
    const words = this.get(head, tail);
    if (!words) {
      return undefined;
    }
    return [head, tail, words.indexOf(word)];
  }
  hasWord(word: string, headIdx: number, tailIdx: number): boolean {
    const [head, tail] = getHeadTail(word, headIdx, tailIdx);
    const words = this.get(head, tail) || [];

    return words.includes(word);
  }
  getMoves(filterFunc: (word: string) => boolean): EdgeMap<number[]> {
    const indexMap: EdgeMap<number[]> = new EdgeMap();

    for (const [head, tail, arr] of this.toArray()) {
      for (const i in arr) {
        if (filterFunc(arr[i])) {
          indexMap.get(head, tail, []).push(Number(i));
        }
      }
    }
    return indexMap;
  }

  getWord(head: NodeName, tail: NodeName, idx: number): string | undefined {
    return (this.get(head, tail) || [])[idx];
  }
  getAllWords() {
    const result: string[] = [];
    for (const [, , arr] of this.toArray()) {
      result.push(...arr);
    }
    return result;
  }
  getSize() {
    return this.toArray().reduce((prev, curr) => prev + curr[2].length, 0);
  }
}
