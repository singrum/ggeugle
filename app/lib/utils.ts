import { clsx, type ClassValue } from "clsx";
import { get, has, set } from "lodash-es";
import { twMerge } from "tailwind-merge";
import type { Kkutu3Rule, KkutuRule, LoaderData, RuleForm } from "~/types/rule";

import { cates, dicts, kkutu3Info, kkutuInfo, poses } from "~/constants/rule";
import { sampleRules } from "~/constants/sample-rules";

import type { MetaArgs, MetaDescriptor } from "react-router";
import { storage } from "./storage/storage";
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

export function getStaticLoaderDataById(id: string): LoaderData | null {
  const sampleRule = sampleRules.find((rule) => rule.id === id);
  if (sampleRule) {
    return {
      title: sampleRule.metadata.title,
      isSample: true,
      id,
      updatedAt: sampleRule.metadata.updatedAt,
      color: sampleRule.metadata.color,
    };
  }
  const kkutuRule = getKkutuRule(id);
  if (kkutuRule) {
    const kkutuRuleForm = getKkutuRuleForm(kkutuRule);
    if (kkutuRuleForm) {
      return {
        title: kkutuRuleForm.metadata.title,
        isSample: true,
        id,
        updatedAt: kkutuRuleForm.metadata.updatedAt,
        color: kkutuRuleForm.metadata.color,
      };
    }
  }
  return null;
}

export async function getLoaderDataById(id: string): Promise<LoaderData> {
  const sampleRule = sampleRules.find((rule) => rule.id === id);
  // 샘플 룰에서 검색
  if (sampleRule) {
    return {
      title: sampleRule.metadata.title,
      isSample: true,
      id,
      updatedAt: sampleRule.metadata.updatedAt,
      color: sampleRule.metadata.color,
    };
  }

  // 끄투룰에서 검색
  const kkutuRule = getKkutuRule(id);
  if (kkutuRule) {
    const kkutuRuleForm = getKkutuRuleForm(kkutuRule);
    if (kkutuRuleForm) {
      return {
        title: kkutuRuleForm.metadata.title,
        isSample: true,
        id,
        updatedAt: kkutuRuleForm.metadata.updatedAt,
        color: kkutuRuleForm.metadata.color,
      };
    }
  }

  // 끄투3 룰에서 검색
  const kkutu3Rule = getKkutu3Rule(id);

  if (kkutu3Rule) {
    const kkutu3RuleForm = getKkutu3RuleForm(kkutu3Rule);

    if (kkutu3RuleForm) {
      return {
        title: kkutu3RuleForm.metadata.title,
        isSample: true,
        id,
        updatedAt: kkutu3RuleForm.metadata.updatedAt,
        color: kkutu3RuleForm.metadata.color,
      };
    }
  }

  // 스토리지에서 검색
  const data = await storage.getRuleFormById(id);
  if (data) {
    return {
      title: data.metadata.title,
      isSample: false,
      id,
      updatedAt: data.metadata.updatedAt,
      color: data.metadata.color,
    };
  }
  throw new Error("Rule not found");
}

export async function getRuleFormById(
  id: string,
): Promise<{ ruleForm: RuleForm; isSample: boolean }> {
  // 기본 룰에서 검색
  const sampleRule = sampleRules.find((rule) => rule.id === id);
  if (sampleRule) {
    return {
      ruleForm: sampleRule,
      isSample: true,
    };
  }

  // 끄투룰에서 검색
  const kkutuRule = getKkutuRule(id);

  if (kkutuRule) {
    const kkutuRuleForm = getKkutuRuleForm(kkutuRule);
    if (kkutuRuleForm) {
      return {
        ruleForm: kkutuRuleForm,
        isSample: true,
      };
    }
  }

  // 끄투3 룰에서 검색
  const kkutu3Rule = getKkutu3Rule(id);

  if (kkutu3Rule) {
    const kkutu3RuleForm = getKkutu3RuleForm(kkutu3Rule);
    if (kkutu3RuleForm) {
      return {
        ruleForm: kkutu3RuleForm,
        isSample: true,
      };
    }
  }

  // 스토리지에서 검색

  const data = await storage.getRuleFormById(id);
  if (data) {
    return {
      ruleForm: data,
      isSample: false,
    };
  }

  throw new Error("해당 룰을 찾을 수 없습니다.");
}

export function getKkutuRuleTitle(rule: KkutuRule): string {
  return `끄투코리아-${kkutuInfo.gameType[rule.gameType]}-${kkutuInfo.injeong[Number(rule.injeong)]}-${kkutuInfo.manner[rule.manner]}`;
}

export function getKkutu3RuleTitle(rule: Kkutu3Rule): string {
  return `끄투3-${kkutu3Info.gameType[rule.gameType]}-${kkutu3Info.dict[rule.dict]}-${rule.manner ? "매너" : "노매너"}${`${rule.three ? "-쿵쿵따" : ""}`}`;
}

export function getKkutuRule(title: string): KkutuRule | null {
  const parts = title.split("-");
  if (parts.length !== 4) return null;
  const [prefix, gameTypeStr, injeongStr, mannerStr] = parts;
  if (prefix !== "끄투코리아") return null;
  const gameType = Object.entries(kkutuInfo.gameType).find(
    ([, value]) => value === gameTypeStr,
  )?.[0];
  const injeong = Object.entries(kkutuInfo.injeong).find(
    ([, value]) => value === injeongStr,
  )?.[0];
  const manner = Object.entries(kkutuInfo.manner).find(
    ([, value]) => value === mannerStr,
  )?.[0];
  if (gameType === undefined || injeong === undefined || manner === undefined) {
    return null;
  }
  return {
    gameType: Number(gameType),
    injeong: Boolean(Number(injeong)),
    manner: Number(manner),
  };
}

export function getKkutu3Rule(title: string): Kkutu3Rule | null {
  const parts = title.split("-");

  const [prefix, gameTypeStr, dictStr, mannerStr] = parts;
  const threeStr = parts[4];
  if (prefix !== "끄투3") return null;
  const gameType = Object.entries(kkutu3Info.gameType).find(
    ([, value]) => value === gameTypeStr,
  )?.[0];

  const dict = Object.entries(kkutu3Info.dict).find(
    ([, value]) => value === dictStr,
  )?.[0];

  const manner =
    mannerStr === "매너" ? true : mannerStr === "노매너" ? false : undefined;

  const three =
    threeStr === "쿵쿵따" ? true : threeStr === undefined ? false : undefined;

  if (
    gameType === undefined ||
    dict === undefined ||
    manner === undefined ||
    three === undefined
  ) {
    return null;
  }

  return {
    gameType: Number(gameType),
    dict: Number(dict),
    manner,
    three,
  };
}

export function getKkutuRuleForm(rule: KkutuRule): RuleForm {
  const title = getKkutuRuleTitle(rule);
  return {
    id: title,
    metadata: {
      title,
      updatedAt: 0,
      color: "yellow",
    },
    content: {
      wordRule: {
        words: {
          type: "selected",
          option: {
            dict: rule.injeong ? 5 : 4,
            pos: toObject(poses, [1, 1, 1, 1, 1, 1, 1, 1, 1]),
            cate: toObject(cates, [1, 1, 1, 1]),
          },
        },
        regexFilter:
          rule.gameType === 1
            ? "(.{3})"
            : rule.gameType === 0 && rule.manner === 1 && !rule.injeong
              ? "(?!(껏구리)$).*"
              : ".*",
        removedWords: "",
        addedWords: "",
      },
      wordConnectionRule: {
        changeFuncIdx: 1,
        rawHeadIdx: 1,
        headDir: rule.gameType === 2 ? 1 : 0,
        rawTailIdx: 1,
        tailDir: rule.gameType === 2 ? 0 : 1,
      },
      postprocessing: {
        manner: {
          type: (rule.manner === 2 ? 3 : rule.manner) as 0 | 1 | 2 | 3,
          nextWordsLimit: rule.manner === 2 ? 6 : undefined,
        },
        addedWords: "",
        removedWords: "",
      },
    },
  };
}

export function getKkutu3RuleForm(rule: Kkutu3Rule): RuleForm {
  const title = getKkutu3RuleTitle(rule);
  const dictIdx = dicts.findIndex(
    (dict) => dict.title === `끄투3 ${kkutu3Info.dict[rule.dict]}`,
  );

  return {
    id: title,
    metadata: {
      title,
      updatedAt: 0,
      color: "green",
    },
    content: {
      wordRule: {
        words: {
          type: "selected",
          option: {
            dict: dictIdx,
            pos: dicts[dictIdx].defaultPos,
            cate: dicts[dictIdx].defaultCate,
          },
        },
        regexFilter: rule.three ? "(.{3})" : ".*",
        removedWords: "",
        addedWords: "",
      },
      wordConnectionRule: {
        changeFuncIdx: 1,
        rawHeadIdx: 1,
        headDir: rule.gameType === 1 ? 1 : 0,
        rawTailIdx: 1,
        tailDir: rule.gameType === 1 ? 0 : 1,
      },
      postprocessing: {
        manner: {
          type: (rule.manner ? 3 : 0) as 0 | 1 | 2 | 3,
          nextWordsLimit: rule.manner ? 10 : undefined,
        },
        addedWords: "",
        removedWords: "",
      },
    },
  };
}

export function mergedMeta(
  matches: MetaArgs["matches"],
  currentMeta: MetaDescriptor[],
): MetaDescriptor[] {
  // matches[0] 대신 모든 상위 matches를 합치거나,
  // 특정하게 root만 타겟팅한다면 아래와 같이 null 체크를 추가하세요.
  const rootMeta = matches[0]?.meta ?? [];

  const filteredParentMeta = rootMeta.filter((pMeta) => {
    // 1. Title 중복 체크
    if ("title" in pMeta && currentMeta.some((c) => "title" in c)) return false;

    // 2. Name/Property 중복 체크
    return !currentMeta.some((cMeta) => {
      const isNameMatch =
        "name" in cMeta && "name" in pMeta && cMeta.name === pMeta.name;
      const isPropertyMatch =
        "property" in cMeta &&
        "property" in pMeta &&
        cMeta.property === pMeta.property;
      return isNameMatch || isPropertyMatch;
    });
  });

  return [...filteredParentMeta, ...currentMeta];
}

export function metaTitle(title: string): MetaDescriptor[] {
  return [
    { title: `${title}` },
    { property: "og:title", content: title },
    { property: "twitter:title", content: title },
  ];
}

export function metaDescription(description: string): MetaDescriptor[] {
  return [
    { name: "description", content: description },
    { property: "og:description", content: description },
    { property: "twitter:description", content: description },
  ];
}

export function metaImage(imageUrl: string): MetaDescriptor[] {
  return [
    { property: "og:image", content: imageUrl },
    { property: "twitter:image", content: imageUrl },
  ];
}
