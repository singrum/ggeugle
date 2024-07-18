import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function compareWord(a: string, b: string) {
  const a_ = a[0] + a[-1] + a;
  const b_ = b[0] + b[-1] + b;
  return a_ > b_ ? 1 : -1;
}
// export function compareKey(key1: string, key2: string) {
//   // 0>1>2>3>wincir>route>loscir>-5>-3>-2
//   const num1 = parseInt(key1)
//   const num2 = parseInt(key2)
//   if(!isNaN(num1) && !isNaN(num2)){
//     if(num1 >=0 && num2 >=0){
//       num1 >=0
//     }
//   }
// }
