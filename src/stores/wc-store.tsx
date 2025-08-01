import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import Cookies from "js-cookie";
import { create } from "zustand";

import type { Chat } from "../types/play";
import { createCriticalWordsSlice } from "./slices/critical-words-slice";
import { createDistributionSlice } from "./slices/distribution-slice";
import { createInfoSlice } from "./slices/info-slice";
import { createPlaySlice } from "./slices/play-slice";
import { createRuleSlice } from "./slices/rule-slice";
import { createSearchSlice } from "./slices/search-slice";
import { createStrategySearchSlice } from "./slices/strategy-search-slice";
import type { Slices } from "./types/wc-store";

// js-cookie를 사용하는 StateStorage 구현
const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 365 }); // 1년간 쿠키 유지
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

export const useWcStore = create<Slices>()(
  persist(
    // 1. persist 미들웨어로 감싸기
    immer((...a) => ({
      ...createRuleSlice(...a),
      ...createSearchSlice(...a),
      ...createStrategySearchSlice(...a),
      ...createCriticalWordsSlice(...a),
      ...createPlaySlice(...a),
      ...createInfoSlice(...a),
      ...createDistributionSlice(...a),
    })),
    {
      name: "ggeugle",
      storage: createJSONStorage(() => cookieStorage),

      partialize: (state) => ({
        gameSettingsInfo: state.gameSettingsInfo,
        charMenu: state.charMenu,
        view: state.view,
        autoSearch: state.autoSearch,
        defaultAllOpen: state.defaultAllOpen,
        maxThreadValue: state.maxThreadValue,
        debugOpen: state.debugOpen,
        comparisonToast: state.comparisonToast,
        kkutuLocalRule: state.kkutuLocalRule,
        distributionNodeType: state.distributionNodeType,
        wordDistributionOption: state.wordDistributionOption,
        precedenceRule: state.precedenceRule,
      }),
    },
  ),
);

export function getMovesFromChats(chats: Chat[]): string[] {
  return chats.filter((e) => e.type === "move").map((e) => e.content as string);
}
