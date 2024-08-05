import { create } from "zustand";
import {
  BarChartIcon,
  BotIcon,
  PieChart,
  SearchIcon,
  Settings,
} from "lucide-react";

export type Menu = { index: number; name: string; icon: React.ReactElement };
export const menus: Menu[] = [
  { index: 0, name: "검색", icon: <SearchIcon strokeWidth={1.5} /> },
  { index: 1, name: "플레이", icon: <BotIcon strokeWidth={1.5} /> },
  { index: 2, name: "통계", icon: <PieChart strokeWidth={1.5} /> },
  { index: 3, name: "설정", icon: <Settings strokeWidth={1.5} /> },
];
export interface MenuInfo {
  menu: Menu;
  setMenu: (index: number) => void;
}

export const useMenu = create<MenuInfo>((set) => ({
  menu: menus[0],
  setMenu: (index: number) => set(() => ({ menu: menus[index] })),
}));
