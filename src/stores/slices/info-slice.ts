// import * as Comlink from "comlink";
import { type StateCreator } from "zustand";
import type { InfoSlice, Slices } from "../types/wc-store";
export const createInfoSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  InfoSlice
> = (set) => ({
  isDefaultOpenDonation: true,
  setIsDefaultOpenDonation: (value: boolean) =>
    set({ isDefaultOpenDonation: value }),
});
