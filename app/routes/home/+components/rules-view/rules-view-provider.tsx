import { type ReactNode, createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

export type RulesViewState = {
  rules: {
    id: string;
    title: string;
    color: string;
  }[];
  isSample: boolean;
  selectedRuleId: string | null;
};

export type RulesViewActions = {
  select: (id: string | null) => void;
};

export type RulesViewStore = RulesViewState & RulesViewActions;

export const defaultInitState: Partial<RulesViewState> = {
  selectedRuleId: null,
};

export const createRulesStore = (initState: RulesViewState) => {
  return createStore<RulesViewStore>()((set) => ({
    ...defaultInitState,
    ...initState,
    select: (id: string | null) => set(() => ({ selectedRuleId: id })),
  }));
};

export type RulesViewStoreApi = ReturnType<typeof createRulesStore>;

export const RulesViewStoreContext = createContext<
  RulesViewStoreApi | undefined
>(undefined);

export interface RulesViewStoreProviderProps {
  rules: { id: string; title: string; color: string }[];
  isSample: boolean;
  children: ReactNode;
}

export const RulesViewStoreProvider = ({
  children,
  rules,
  isSample,
}: RulesViewStoreProviderProps) => {
  const [store] = useState(() =>
    createRulesStore({ rules, isSample, selectedRuleId: null }),
  );
  return (
    <RulesViewStoreContext.Provider value={store}>
      {children}
    </RulesViewStoreContext.Provider>
  );
};

export const useRulesViewStore = <T,>(
  selector: (store: RulesViewStore) => T,
): T => {
  const rulesViewStoreContext = useContext(RulesViewStoreContext);
  if (!rulesViewStoreContext) {
    throw new Error(
      `useRulesViewStore must be used within RulesViewStoreProvider`,
    );
  }

  return useStore(rulesViewStoreContext, selector);
};
