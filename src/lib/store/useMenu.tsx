import { Menu } from "lucide-react";
import { ReactElement } from "react";
import {
  RiPieChartFill,
  RiPieChartLine,
  RiRobot2Fill,
  RiRobot2Line,
  RiSearchFill,
  RiSearchLine,
  RiSettings3Fill,
  RiSettings3Line,
} from "react-icons/ri";
import { create } from "zustand";
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
  // {
  //   index: 1,
  //   name: "플레이",
  //   icon: <RiRobot2Line className="w-5 h-5" />,
  //   focusedIcon: <RiRobot2Fill className="w-5 h-5" />,
  // },
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
  {
    index: 4,
    name: "더보기",
    icon: <Menu className="w-5 h-5" />,
    focusedIcon: <Menu className="w-5 h-5" />,
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
