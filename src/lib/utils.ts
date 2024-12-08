import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Chat } from "./store/useWC";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pushObject(
  obj: { [key: string]: any[] },
  key: string | number,
  value: any
) {
  if (!obj[key]) {
    obj[key] = [];
  }
  obj[key].push(value);
}

export function choice(arr: any[]) {
  if (arr.length > 0) return arr[Math.floor(Math.random() * arr.length)];
  else return undefined;
}

export function arrayToKeyMap(array: string[], callback: (key: string) => any) {
  const result: Record<string, any> = array.reduce(
    (acc: Record<string, any>, curr) => ((acc[curr] = callback(curr)), acc),
    {}
  );

  return result;
}

export function chatSplit(chats: Chat[]) {
  const result: { chats: Chat[]; isMy: boolean }[] = [];

  for (let chat of chats) {
    if (result.length === 0 || result.at(-1)!.isMy !== chat.isMy)
      result.push({ isMy: chat.isMy, chats: [chat] });
    else result.at(-1)!.chats.push(chat);
  }

  return result;
}

export function mex(arr: number[]) {
  const seen = new Set();

  for (let i = 0; i < arr.length; i++) {
    seen.add(arr[i]);
  }

  for (let i = 1; i <= arr.length + 1; i++) {
    if (!seen.has(i)) return i;
  }

  return 1;
}

export function arraysEqual(a: string[], b: string[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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

export function getChatIdxByMoveIdx(chats: Chat[], moveIdx: number) {
  let idx = 0;
  let moveCnt = 0;
  for (const chat of chats) {
    if (!chat.isWord) idx++;
    else if (moveIdx !== moveCnt) {
      moveCnt++;
      idx++;
    } else {
      return idx;
    }
  }
}
