import { create } from "zustand";
import {
  BarChartIcon,
  BotIcon,
  PieChart,
  SearchIcon,
  Settings,
} from "lucide-react";
import { ReactElement } from "react";
import {
  RiSearchFill,
  RiSearchLine,
  RiRobot2Line,
  RiRobot2Fill,
  RiPieChartLine,
  RiPieChartFill,
  RiSettings3Line,
  RiSettings3Fill,
} from "react-icons/ri";
export type Menu = {
  index: number;
  name: string;
  icon: React.ReactElement;
  focusedIcon: ReactElement;
};
export const menus: Menu[] = [
  {
    index: 0,
    name: "검색",
    icon: <RiSearchLine className="w-5 h-5" />,
    focusedIcon: <RiSearchFill className="w-5 h-5" />,
  },
  {
    index: 1,
    name: "플레이",
    icon: <RiRobot2Line className="w-5 h-5" />,
    focusedIcon: <RiRobot2Fill className="w-5 h-5" />,
  },
  {
    index: 2,
    name: "통계",
    icon: <RiPieChartLine className="w-5 h-5" />,
    focusedIcon: <RiPieChartFill className="w-5 h-5" />,
  },
  {
    index: 3,
    name: "설정",
    icon: <RiSettings3Line className="w-5 h-5" />,
    focusedIcon: <RiSettings3Fill className="w-5 h-5" />,
  },
];
export interface MenuInfo {
  menu: Menu;
  setMenu: (index: number) => void;
}

export const useMenu = create<MenuInfo>((set) => ({
  menu: menus[0],
  setMenu: (index: number) => set(() => ({ menu: menus[index] })),
}));
