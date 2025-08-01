// import * as Comlink from "comlink";
import type { MoveType } from "@/types/search";
import { type StateCreator } from "zustand";
import type { DistributionSlice, Slices } from "../types/wc-store";
export const createDistributionSlice: StateCreator<
  Slices,
  [["zustand/immer", never]],
  [],
  DistributionSlice
> = (set, get) => ({
  distributionNodeType: "win",
  wordDistributionOption: {
    type: "adjacent",
    direction: 0,
    sort: { key: "total", desc: true },
    displayType: "number",
  },
  distributionTablePage: 1,
  setDistributionTablePage: (page: number) =>
    set({ distributionTablePage: page }),

  setDistributionData: (data: DistributionSlice["distributionData"]) => {
    set({
      distributionData: data,
      distributionRows: ([0, 1, 2, 3, 4, 5] as MoveType[]).filter((type) =>
        data ? data.some((e) => e.num[type] > 0) : true,
      ),
    });
    get().setDistributionTablePage(1);
  },
  distributionRows: [0, 1, 2, 3, 4, 5],
});
