import { create } from "zustand";
import { Rule, WCengine } from "../wc/WordChain";
import { BarChartIcon, BotIcon, SearchIcon } from "lucide-react";
import { useWC } from "./useWC";

export interface SearchInfo {
  value: string;
  setValue: (value: string) => void;
  exceptWords: string[];
  setExceptWords: (exceptWords: string[]) => void;
}

export const useSearch = create<SearchInfo>((set, get) => ({
  value: "",
  setValue: (value: string) => {
    set(() => ({ value }));
  },
  exceptWords: [],
  setExceptWords: (exceptWords: string[]) => set(() => ({ exceptWords })),
}));
