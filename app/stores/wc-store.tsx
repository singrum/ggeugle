import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createStore } from "zustand";
import { localStorageVersion } from "~/lib/local-storage";
import { createCriticalWordsSlice } from "./slices/critical-words-slice";
import { createDistributionSlice } from "./slices/distribution-slice";

import { createPlaySlice } from "./slices/play-slice";
import { createRuleSlice } from "./slices/rule-slice";
import { createSearchSlice } from "./slices/search-slice";
import { createStrategySearchSlice } from "./slices/strategy-search-slice";
import type { Slices } from "./types/wc-store";

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
        ...createDistributionSlice(...a),
        ...initProps, // 초기 주입된 props로 상태 덮어쓰기
      })),
      {
        name: "ggeugle",
        version: localStorageVersion,
        storage: createJSONStorage(() => localStorage),
        migrate: (persistedState, version) => {
          if (version !== localStorageVersion) {
            return undefined;
          }
          return persistedState;
        },
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
          wordSortType: state.wordSortType,
          flow: state.flow,
        }),
      },
    ),
  );
};
