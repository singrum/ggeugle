import { create } from "zustand";
import { Rule, WCengine } from "../wc/WordChain";
import { BarChartIcon, BotIcon, SearchIcon } from "lucide-react";

export type Menu = { index: number; name: string; icon: React.ReactElement };
export const menus: Menu[] = [
  { index: 0, name: "검색", icon: <SearchIcon /> },
  { index: 1, name: "연습", icon: <BotIcon /> },
  { index: 2, name: "통계", icon: <BarChartIcon /> },
];
export interface MenuInfo {
  menu: Menu;
  setMenu: (index: number) => void;
}

export const useMenu = create<MenuInfo>((set, get) => ({
  menu: menus[0],
  setMenu: (index: number) => set(() => ({ menu: menus[index] })),
}));
