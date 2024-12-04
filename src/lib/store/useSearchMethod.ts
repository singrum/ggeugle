import { create } from "zustand";

export interface SearchMethodInfo {
  searchMethod: "dfs" | "ids";
  setSearchMethod: (SearchMethod: "dfs" | "ids") => void;
}

export const useSearchMethod = create<SearchMethodInfo>((set) => ({
  searchMethod: "dfs",
  setSearchMethod: (searchMethod: "dfs" | "ids") =>
    set(() => ({ searchMethod })),
}));
