"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export type IkkiAlertState = {
  open: boolean;
  updatedAt: number | null;
  setOpen: (open: boolean) => void;
};

export type IkkiAlertStore = IkkiAlertState;

export type initState = {};

export const createIkkiAlertStore = () => {
  return createStore<IkkiAlertStore>()(
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
        name: "ggeugle-ikki-alert-store",
        version: 2,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          open: state.open,
          updatedAt: state.updatedAt,
        }),
      },
    ),
  );
};

export type IkkiAlertStoreApi = ReturnType<typeof createIkkiAlertStore>;

export const IkkiAlertStoreContext = createContext<
  IkkiAlertStoreApi | undefined
>(undefined);

export interface IkkiAlertStoreProviderProps {
  children: ReactNode;
}

export const IkkiAlertStoreProvider = ({
  children,
}: IkkiAlertStoreProviderProps) => {
  const [store] = useState(() => createIkkiAlertStore());

  return (
    <IkkiAlertStoreContext.Provider value={store}>
      {children}
    </IkkiAlertStoreContext.Provider>
  );
};

export const useIkkiAlertStore = <T,>(
  selector: (store: IkkiAlertStore) => T,
): T => {
  const ikkiAlertStoreContext = useContext(IkkiAlertStoreContext);
  if (!ikkiAlertStoreContext) {
    throw new Error(
      `useIkkiAlertStore must be used within IkkiAlertStoreProvider`,
    );
  }

  return useStore(ikkiAlertStoreContext, selector);
};

export const useIkkiAlertStoreApi = () => {
  const ikkiAlertStoreContext = useContext(IkkiAlertStoreContext);
  if (!ikkiAlertStoreContext) {
    throw new Error(
      `useIkkiAlertStoreApi must be used within IkkiAlertStoreProvider`,
    );
  }
  return ikkiAlertStoreContext;
};
