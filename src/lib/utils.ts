import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
