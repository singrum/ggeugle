import { Menu } from "lucide-react";
import { ReactElement } from "react";
import {
  RiMenu2Fill,
  RiMenu2Line,
  RiPieChartFill,
  RiPieChartLine,
  RiRobot2Fill,
  RiRobot2Line,
  RiSearch2Fill,
  RiSearch2Line,
  RiSettings3Fill,
  RiSettings3Line,
} from "react-icons/ri";
import { create } from "zustand";
export type Menu = {
  index: number;
  name: string;
  icon: React.ReactElement;
};
export const menus: Menu[] = [
  {
    index: 0,
    name: "검색",
    icon: <RiSearch2Fill className="w-6 h-6 md:w-5 md:h-5" />,
  },

  {
    index: 2,
    name: "통계",
    icon: <RiPieChartFill className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    index: 1,
    name: "플레이",
    icon: <RiRobot2Fill className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    index: 3,
    name: "룰 설정",
    icon: <RiSettings3Fill className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    index: 4,
    name: "더보기",
    icon: <RiMenu2Fill className="w-6 h-6 md:w-5 md:h-5" />,
    // focusedIcon: <RiMenu2Fill className="w-6 h-6 md:w-5 md:h-5" />,
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