import { create } from "zustand";

export const charMenuList = [
  { name: "승리", index: 0, color: "win" },
  { name: "패배", index: 1, color: "los" },
  { name: "루트", index: 2, color: "route" },
];

export interface CharMenuInfo {
  charMenu: number;

  setCharMenu: (charMenu: number) => void;
}

export const useCharMenu = create<CharMenuInfo>((set) => ({
  charMenu: 0,

  setCharMenu: (charMenu: number) => set({ charMenu }),
}));
