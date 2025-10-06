import type { RuleForm } from "@/types/rule";
import { clsx, type ClassValue } from "clsx";
import { get, has, isEqual, set } from "lodash";
import { twMerge } from "tailwind-merge";

import { EdgeCounter } from "./wordchain/classes/edge-counter";
import type { NodeName } from "./wordchain/graph/graph";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIdx(rawIdx: number, dir: 0 | 1) {
  return dir === 0 ? rawIdx - 1 : -rawIdx;
}

export function getHeadTail(
  word: string,
  headIdx: number,
  tailIdx: number,
): [string, string] {
  const head = word.at(headIdx);
  if (!head) {
    throw `${word} has not ${headIdx}'th index`;
  }
  const tail = word.at(tailIdx);
  if (!tail) {
    throw `${word} has not ${tailIdx}'th index`;
  }
  return [head, tail];
}

export function toObject<T extends string>(keys: T[], values: (0 | 1)[]) {
  const obj = keys.reduce(
    (acc, key, i) => {
      acc[key] = values[i];
      return acc;
    },
    {} as Record<T, 0 | 1>,
  );
  return obj;
}

export function removeDup<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function lexCompare(a: number[], b: number[]) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  // 앞부분이 같다면 길이로 비교
  if (a.length < b.length) return -1;
  if (a.length > b.length) return 1;
  return 0;
}
export function getCookieValue(key: string) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [k, v] = cookie.split("=");
    if (k === key) {
      return decodeURIComponent(v);
    }
  }
  return null; // 해당 키가 없을 경우
}

export function compareTuple(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return a.length - b.length;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return 0;
}

export function isEqualRules(rule1: RuleForm, rule2: RuleForm) {
  const rule1WithoutMetadata = { ...rule1 };
  delete rule1WithoutMetadata.metadata;
  const rule2WithoutMetadata = { ...rule2 };
  delete rule2WithoutMetadata.metadata;
  return isEqual(rule1WithoutMetadata, rule2WithoutMetadata);
}

export function removeMetaData(rule: RuleForm) {
  const ruleWithoutMetadata = { ...rule };
  delete ruleWithoutMetadata.metadata;
  return ruleWithoutMetadata;
}

export function wordsToMoves(
  words: string[],
  headIdx: number,
  tailIdx: number,
): [NodeName, NodeName, number][] {
  const counter: EdgeCounter = new EdgeCounter();
  for (const word of words) {
    const [head, tail] = getHeadTail(word, headIdx, tailIdx);

    counter.increase(head, tail, 1);
  }

  return counter.toArray();
}

export function removeDuplicatesFromIndex<T>(arr: T[], startIdx: number): T[] {
  const seen = new Set<T>();
  const result: T[] = [];

  // 먼저 startIdx 이전까지는 무조건 포함하고, seen에 기록
  for (let i = 0; i < startIdx; i++) {
    const item = arr[i];
    seen.add(item);
    result.push(item);
  }

  // 이후부터는 중복 여부 검사 후 추가
  for (let i = startIdx; i < arr.length; i++) {
    const item = arr[i];
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }

  return result;
}

export function groupByConsecutiveCallback<T>(
  arr: T[],
  callback: (e: T) => unknown,
): T[][] {
  if (arr.length === 0) return [];

  const result: T[][] = [];
  let currentGroup: T[] = [arr[0]];

  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i - 1];
    const curr = arr[i];

    if (callback(prev) === callback(curr)) {
      currentGroup.push(curr);
    } else {
      result.push(currentGroup);
      currentGroup = [curr];
    }
  }

  result.push(currentGroup); // 마지막 그룹 추가
  return result;
}

export function getRegex(rawStr: string): RegExp | null {
  try {
    return new RegExp(rawStr);
  } catch {
    return null;
  }
}

export function getCurrentDateTime() {
  // 현재 날짜 시간 구하기
  const now = new Date();
  // 년
  const year = now.getFullYear();
  // 월
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  // 일
  const day = now.getDate().toString().padStart(2, "0");
  // 시
  const hours = now.getHours().toString().padStart(2, "0");
  // 분
  const minutes = now.getMinutes().toString().padStart(2, "0");
  // 초
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return year + month + day + hours + minutes + seconds;
}

export function downloadText(title: string, s: string) {
  const link = document.createElement("a");
  link.download = `끄글_${title}_${getCurrentDateTime()}.txt`;
  const blob = new Blob([s], {
    type: "text/plain",
  });
  link.href = window.URL.createObjectURL(blob);
  link.click();
}

export function getOrSetDefault<
  T,
  O extends object,
  P extends string | readonly string[],
>(obj: O, path: P, defaultValue: T): T {
  if (!has(obj, path)) {
    set(obj, path, defaultValue);
  }
  return get(obj, path) as T;
}

export function toNestedRecord(
  pairs: [string, string][],
): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};

  for (const [key1, key2] of pairs) {
    if (!result[key1]) result[key1] = {};
    result[key1][key2] = 0;
  }

  return result;
}

export function arrayToEdgeObject<T>(
  arr: [NodeName, NodeName, T][],
): Record<NodeName, Record<NodeName, T>> {
  const result: Record<NodeName, Record<NodeName, T>> = {};
  for (const [start, end, val] of arr) {
    (result[start] ??= {})[end] = val;
  }
  return result;
}

export function arrToString(arr: string[], maxDisplay: number) {
  if (arr.length <= maxDisplay) {
    return arr.join(", ");
  } else {
    return arr.slice(0, maxDisplay).join(", ") + "...";
  }
}

export function truncate<T>(elements: T[], toString: (e: T) => string) {
  const maxDisplay = 10;
  if (elements.length <= maxDisplay) {
    return elements.map((e) => toString(e)).join(", ");
  } else {
    return (
      elements
        .slice(0, maxDisplay)
        .map((e) => toString(e))
        .join(", ") + ",..."
    );
  }
}

export function compareEdge(a: [string, string], b: [string, string]) {
  return a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]);
}

export function setTitle(ruleName: string) {
  document.title = ruleName + " | " + "끝말잇기 엔진";
}
