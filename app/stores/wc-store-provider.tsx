"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import type { RuleForm } from "~/types/rule";
import type { PrecInfo } from "~/types/search";
import { createWcStore, type WcState } from "./wc-store";

export type WcStoreApi = ReturnType<typeof createWcStore>;

export const WcStoreContext = createContext<WcStoreApi | undefined>(undefined);

export interface WcStoreProviderProps {
  ruleForm: RuleForm;
  prec: PrecInfo;
  children: React.ReactNode;
}

export const WcStoreProvider = ({
  ruleForm,
  prec,
  children,
}: WcStoreProviderProps) => {
  const [store] = useState(() =>
    createWcStore({
      ruleForm,
      prec,
    }),
  );

  useEffect(() => {
    const { updateRule } = store.getState();

    if (updateRule) {
      updateRule();
    }
  }, [store, ruleForm, prec]); // ruleForm이 외부에서 바뀌면 스토어 데이터도 동기화

  return (
    <WcStoreContext.Provider value={store}>{children}</WcStoreContext.Provider>
  );
};

export const useWcStore = <T,>(selector: (state: WcState) => T): T => {
  const wcStoreContext = useContext(WcStoreContext);
  if (!wcStoreContext) {
    throw new Error(`useWcStore must be used within WcStoreProvider`);
  }

  return useStore(wcStoreContext, selector);
};

export const useWcStoreApi = () => {
  const context = useContext(WcStoreContext);
  if (!context)
    throw new Error("useWcStoreApi must be used within WcStoreProvider");
  return context;
};
