import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import { localStorageVersion } from "~/lib/local-storage";
export const views = ["list", "grid"] as const;

export type Kkutu3RuleState = {
  kkutu3LocalRule: {
    gameType: number;
    dict: number;
    manner: boolean;
    three: boolean;
  };
};

export type Kkutu3RuleActions = {};

export type Kkutu3RuleStore = Kkutu3RuleState & Kkutu3RuleActions;

export const createKkutu3RuleStore = (initState: Kkutu3RuleState) => {
  return createStore<Kkutu3RuleStore>()(
    persist(
      immer(() => ({
        ...initState,
      })),
      {
        name: "ggeuglekkutu3",
        version: localStorageVersion,
        migrate: (persistedState, version) => {
          if (version !== localStorageVersion) {
            return undefined;
          }
          return persistedState as Kkutu3RuleStore;
        },
        partialize: (state) => ({ kkutu3LocalRule: state.kkutu3LocalRule }),
      },
    ),
  );
};

export type Kkutu3RuleStoreApi = ReturnType<typeof createKkutu3RuleStore>;

export const Kkutu3RuleStoreContext = createContext<
  Kkutu3RuleStoreApi | undefined
>(undefined);

export interface Kkutu3RuleStoreProviderProps {
  children: React.ReactNode;
}

export const Kkutu3RuleStoreProvider = ({
  children,
}: Kkutu3RuleStoreProviderProps) => {
  const [store] = useState(() =>
    createKkutu3RuleStore({
      kkutu3LocalRule: { gameType: 0, dict: 1, manner: false, three: false },
    }),
  );

  return (
    <Kkutu3RuleStoreContext.Provider value={store}>
      {children}
    </Kkutu3RuleStoreContext.Provider>
  );
};

export const useKkutu3RuleStore = <T,>(
  selector: (store: Kkutu3RuleStore) => T,
): T => {
  const kkutu3RuleStoreContext = useContext(Kkutu3RuleStoreContext);

  if (!kkutu3RuleStoreContext) {
    throw new Error(
      `useKkutu3RuleStore must be used within Kkutu3RuleStoreProvider`,
    );
  }

  return useStore(kkutu3RuleStoreContext, selector);
};

export const useKkutu3RuleStoreApi = () => {
  const context = useContext(Kkutu3RuleStoreContext);
  if (!context)
    throw new Error(
      "useKkutu3RuleStoreApi must be used within Kkutu3RuleStoreProvider",
    );
  return context;
};
