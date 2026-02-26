import Dexie from "dexie";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createStorageStore, type StorageStore } from "./storage-store";
export type StorageStoreApi = ReturnType<typeof createStorageStore>;

export const StorageStoreContext = createContext<StorageStoreApi | undefined>(
  undefined,
);

export interface StorageStoreProviderProps {
  children: ReactNode;
}

export const StorageStoreProvider = ({
  children,
}: StorageStoreProviderProps) => {
  const db = new Dexie("ikki-engine-storage");
  const [store] = useState(() => createStorageStore());

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
