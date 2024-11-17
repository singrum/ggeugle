import {
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
  name: string;
  icon: React.ReactElement;
  fillIcon: React.ReactElement;
};
export const menus: Menu[] = [
  {
    name: "검색",
    icon: <RiSearch2Line className="w-6 h-6 md:w-5 md:h-5" />,
    fillIcon: <RiSearch2Fill className="w-6 h-6 md:w-5 md:h-5" />,
  },

  {
    name: "통계",
    icon: <RiPieChartLine className="w-6 h-6 md:w-5 md:h-5" />,
    fillIcon: <RiPieChartFill className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    name: "플레이",
    icon: <RiRobot2Line className="w-6 h-6 md:w-5 md:h-5" />,
    fillIcon: <RiRobot2Fill className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    name: "룰 설정",
    icon: <RiSettings3Line className="w-6 h-6 md:w-5 md:h-5" />,
    fillIcon: <RiSettings3Fill className="w-6 h-6 md:w-5 md:h-5" />,
  },
];
export interface MenuInfo {
  menu: number;
  setMenu: (index: number) => void;
}

export const useMenu = create<MenuInfo>((set) => ({
  menu: 0,
  setMenu: (index: number) => set(() => ({ menu: index })),
}));
