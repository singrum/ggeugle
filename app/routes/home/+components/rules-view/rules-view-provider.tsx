import { arrayMove } from "@dnd-kit/sortable";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import type { RuleMetadata } from "~/types/rule";
export const views = ["list", "grid"] as const;

export type RulesViewState = {
  rules: { id: string; order: number; metadata: RuleMetadata }[];

  isSample: boolean;
  selectedRuleId: string | null;
};

export type RulesViewActions = {
  select: (id: string | null) => void;

  reorder: (activeId: string, overId: string) => void;
};

export type RulesViewStore = RulesViewState & RulesViewActions;

export const createRulesStore = (initState: RulesViewState) => {
  return createStore<RulesViewStore>()((set) => ({
    ...initState,
    select: (id: string | null) => set(() => ({ selectedRuleId: id })),
    reorder: (activeId, overId) =>
      set((state) => {
        const oldIndex = state.rules.findIndex((r) => r.id === activeId);
        const newIndex = state.rules.findIndex((r) => r.id === overId);
        return { rules: arrayMove(state.rules, oldIndex, newIndex) };
      }),
  }));
};

export type RulesViewStoreApi = ReturnType<typeof createRulesStore>;

export const RulesViewStoreContext = createContext<
  RulesViewStoreApi | undefined
>(undefined);

export interface RulesViewStoreProviderProps {
  rules: { id: string; order: number; metadata: RuleMetadata }[];
  isSample: boolean;
  children: ReactNode;
}

export const RulesViewStoreProvider = ({
  children,
  rules,
  isSample,
}: RulesViewStoreProviderProps) => {
  const [store] = useState(() =>
    createRulesStore({
      rules,
      isSample,
      selectedRuleId: null,
    }),
  );

  useEffect(() => {
    store.setState({ rules, isSample });
  }, [rules, isSample]);

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
