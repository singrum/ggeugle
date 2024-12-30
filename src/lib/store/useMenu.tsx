import {
  IoGameController,
  IoGameControllerOutline,
  IoPieChart,
  IoPieChartOutline,
  IoSearch,
  IoSearchOutline,
  IoSettings,
  IoSettingsOutline,
} from "react-icons/io5";
import { create } from "zustand";
export type Menu = {
  name: string;
  icon: React.ReactElement;
  fillIcon: React.ReactElement;
};
export const menus: Menu[] = [
  {
    name: "검색",
    icon: <IoSearchOutline className="w-6 h-6 md:w-5 md:h-5" />,
    fillIcon: <IoSearch className="w-6 h-6 md:w-5 md:h-5" />,
  },

  {
    name: "통계",
    icon: <IoPieChartOutline className="w-6 h-6 md:w-5 md:h-5" />,
    fillIcon: <IoPieChart className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    name: "플레이",
    icon: <IoGameControllerOutline className="w-6 h-6 md:w-5 md:h-5" />,
    fillIcon: <IoGameController className="w-6 h-6 md:w-5 md:h-5" />,
  },
  {
    name: "룰 설정",
    icon: <IoSettingsOutline className="w-6 h-6 md:w-5 md:h-5" />,
    fillIcon: <IoSettings className="w-6 h-6 md:w-5 md:h-5" />,
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
