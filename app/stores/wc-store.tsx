import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import Cookies from "js-cookie";

import { createStore } from "zustand";
import { createCriticalWordsSlice } from "./slices/critical-words-slice";
import { createDistributionSlice } from "./slices/distribution-slice";
import { createInfoSlice } from "./slices/info-slice";
import { createKnowledgeSlice } from "./slices/knowledge-slice";
import { createPlaySlice } from "./slices/play-slice";
import { createRuleSlice } from "./slices/rule-slice";
import { createSearchSlice } from "./slices/search-slice";
import { createStrategySearchSlice } from "./slices/strategy-search-slice";
import type { Slices } from "./types/wc-store";

// js-cookie를 사용하는 StateStorage 구현
const cookieStorage: StateStorage = {
  getItem: (name) => {
    const value = Cookies.get(name);
    if (!value) return null;

    try {
      return value;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 365 }); // 1년간 쿠키 유지
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

export type WcState = Slices;
export type WcStore = ReturnType<typeof createWcStore>;

// 스토어 생성기: 매 요청마다 새로운 스토어를 만들기 위함
export const createWcStore = (initProps?: Partial<WcState>) => {
  return createStore<WcState>()(
    persist(
      immer((...a) => ({
        ...createRuleSlice(...a),
        ...createSearchSlice(...a),
        ...createStrategySearchSlice(...a),
        ...createCriticalWordsSlice(...a),
        ...createPlaySlice(...a),
        ...createInfoSlice(...a),
        ...createDistributionSlice(...a),
        ...createKnowledgeSlice(...a),
        ...initProps, // 초기 주입된 props로 상태 덮어쓰기
      })),
      {
        name: "ggeugle",
        version: 4.2,
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
          distributionNodeType: state.distributionNodeType,
          wordDistributionOption: state.wordDistributionOption,
          pageSize: state.pageSize,
          wordDispType: state.wordDispType,
          flow: state.flow,
        }),
      },
    ),
  );
};
