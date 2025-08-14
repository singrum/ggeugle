// import * as Comlink from "comlink";
import { type StateCreator } from "zustand";
import type { KnowledgeSlice, Slices } from "../types/wc-store";
export const createKnowledgeSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  KnowledgeSlice
> = (set) => ({
  knowledgeMenuOpen: false,
  setKnowledgeMenuOpen: (v: boolean) => set({ knowledgeMenuOpen: v }),
});
