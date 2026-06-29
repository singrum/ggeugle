"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export type AlertState = {
  open: boolean;
  updatedAt: number | null;
  setOpen: (open: boolean) => void;
};

export type AlertStore = AlertState;

export type initState = {};

export const createAlertStore = () => {
  return createStore<AlertStore>()(
    persist(
      (set, get) => ({
        open: true,
        updatedAt: null,
        setOpen: (open: boolean) =>
          set({
            open,
            updatedAt: open ? null : Date.now(),
          }),
      }),
      {
        name: "ggeugle-alert-store",
        version: 3,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          open: state.open,
          updatedAt: state.updatedAt,
        }),
      },
    ),
  );
};

export type AlertStoreApi = ReturnType<typeof createAlertStore>;

export const AlertStoreContext = createContext<AlertStoreApi | undefined>(
  undefined,
);

export interface AlertStoreProviderProps {
  children: ReactNode;
}

export const AlertStoreProvider = ({ children }: AlertStoreProviderProps) => {
  const [store] = useState(() => createAlertStore());

  return (
    <AlertStoreContext.Provider value={store}>
      {children}
    </AlertStoreContext.Provider>
  );
};

export const useAlertStore = <T,>(selector: (store: AlertStore) => T): T => {
  const alertStoreContext = useContext(AlertStoreContext);
  if (!alertStoreContext) {
    throw new Error(`useAlertStore must be used within AlertStoreProvider`);
  }

  return useStore(alertStoreContext, selector);
};

export const useAlertStoreApi = () => {
  const alertStoreContext = useContext(AlertStoreContext);
  if (!alertStoreContext) {
    throw new Error(`useAlertStoreApi must be used within AlertStoreProvider`);
  }
  return alertStoreContext;
};
