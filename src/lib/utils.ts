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
