import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { localStorageVersion } from "~/lib/local-storage";
export const views = ["list", "grid"] as const;

export type KkutuRuleState = {
  kkutuLocalRule: { gameType: number; manner: number; injeong: boolean };
};

export type KkutuRuleActions = {};

export type KkutuRuleStore = KkutuRuleState & KkutuRuleActions;

export const createKkutuRuleStore = (initState: KkutuRuleState) => {
  return createStore<KkutuRuleStore>()(
    persist(
      immer(() => ({
        ...initState,
      })),
      {
        name: "ggeuglekkutu",
        version: localStorageVersion,
        migrate: (persistedState, version) => {
          if (version !== localStorageVersion) {
            return undefined;
          }
          return persistedState as KkutuRuleStore;
        },
        partialize: (state) => ({ kkutuLocalRule: state.kkutuLocalRule }),
      },
    ),
  );
};

export type KkutuRuleStoreApi = ReturnType<typeof createKkutuRuleStore>;

export const KkutuRuleStoreContext = createContext<
  KkutuRuleStoreApi | undefined
>(undefined);

export interface KkutuRuleStoreProviderProps {
  children: React.ReactNode;
}

export const KkutuRuleStoreProvider = ({
  children,
}: KkutuRuleStoreProviderProps) => {
  const [store] = useState(() =>
    createKkutuRuleStore({
      kkutuLocalRule: { gameType: 0, manner: 0, injeong: false },
    }),
  );

  return (
    <KkutuRuleStoreContext.Provider value={store}>
      {children}
    </KkutuRuleStoreContext.Provider>
  );
};

export const useKkutuRuleStore = <T,>(
  selector: (store: KkutuRuleStore) => T,
): T => {
  const kkutuRuleStoreContext = useContext(KkutuRuleStoreContext);

  if (!kkutuRuleStoreContext) {
    throw new Error(
      `useKkutuRuleStore must be used within KkutuRuleStoreProvider`,
    );
  }

  return useStore(kkutuRuleStoreContext, selector);
};

export const useKkutuRuleStoreApi = () => {
  const context = useContext(KkutuRuleStoreContext);
  if (!context)
    throw new Error(
      "useKkutuRuleStoreApi must be used within KkutuRuleStoreProvider",
    );
  return context;
};
