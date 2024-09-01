import {
  RiMenu2Fill,
  RiPieChartFill,
  RiRobot2Fill,
  RiSearch2Fill,
  RiSettings3Fill,
} from "react-icons/ri";
import { create } from "zustand";
export type Menu = {
  name: string;
  icon: React.ReactElement;
};
export const menus: Menu[] = [
  {
    name: "검색",
    icon: <RiSearch2Fill className="w-6 h-6 md:w-5 md:h-5" />,
  },

  {
    name: "통계",
    icon: <RiPieChartFill className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    name: "플레이",
    icon: <RiRobot2Fill className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    name: "룰 설정",
    icon: <RiSettings3Fill className="w-6 h-6 md:w-5 md:h-5" />,
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
