import { type ReactNode, createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

export type StorageState = {
  rules: {
    id: string;
    title: string;
    color: string;
  }[];

  selectedRuleId: string | null;
};

export type StorageActions = {
  select: (id: string | null) => void;
};

export type StorageStore = StorageState & StorageActions;

export const defaultInitState: Partial<StorageState> = {
  selectedRuleId: null,
};

export const createStorageStore = (initState: StorageState) => {
  return createStore<StorageStore>()((set) => ({
    ...defaultInitState,
    ...initState,
    select: (id: string | null) => set(() => ({ selectedRuleId: id })),
  }));
};

export type StorageStoreApi = ReturnType<typeof createStorageStore>;

export const StorageStoreContext = createContext<StorageStoreApi | undefined>(
  undefined,
);

export interface StorageStoreProviderProps {
  rules: { id: string; title: string; color: string }[];

  children: ReactNode;
}

export const StorageStoreProvider = ({
  children,
  rules,
}: StorageStoreProviderProps) => {
  const [store] = useState(() =>
    createStorageStore({ rules, selectedRuleId: null }),
  );

  return (
    <StorageStoreContext.Provider value={store}>
      {children}
    </StorageStoreContext.Provider>
  );
};

export const useStorageStore = <T,>(
  selector: (store: StorageStore) => T,
): T => {
  const storageStoreContext = useContext(StorageStoreContext);
  if (!storageStoreContext) {
    throw new Error(`useStorageStore must be used within StorageStoreProvider`);
  }

  return useStore(storageStoreContext, selector);
};
