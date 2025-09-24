// import * as Comlink from "comlink";
import { type StateCreator } from "zustand";
import type { PreferenceSettingsSlice, Slices } from "../types/wc-store";
export const createPreferenceSettingsSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  PreferenceSettingsSlice
> = (set) => ({
  themeColors: [
    "theme-color-5",
    "theme-color-1",
    "theme-color-6",
    "theme-color-4",
  ],
  setThemeColors: (v: PreferenceSettingsSlice["themeColors"]) =>
    set(() => ({ themeColor: v })),
});
