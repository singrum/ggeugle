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
