"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import type { RuleForm } from "~/types/rule";
import { createWcStore, type WcState } from "./wc-store";

export type WcStoreApi = ReturnType<typeof createWcStore>;

export const WcStoreContext = createContext<WcStoreApi | undefined>(undefined);

export interface WcStoreProviderProps {
  ruleForm: RuleForm;
  children: React.ReactNode;
}

export const WcStoreProvider = ({
  ruleForm,
  children,
}: WcStoreProviderProps) => {
  const [store] = useState(() =>
    createWcStore({
      ruleForm,
    }),
  );
  useEffect(() => {
    const { updateRule } = store.getState();

    if (updateRule) {
      updateRule();
      console.log("Rule updated in store via Provider effect");
    }
  }, [store, ruleForm]); // ruleForm이 외부에서 바뀌면 스토어 데이터도 동기화

  return (
    <WcStoreContext.Provider value={store}>{children}</WcStoreContext.Provider>
  );
};

export const useWcStore = <T,>(selector: (state: WcState) => T): T => {
  const wcStoreContext = useContext(WcStoreContext);
  if (!wcStoreContext) {
    throw new Error(`useWcStore must be used within WcStoreProvider`);
  }

  // useStore(스토어_인스턴스, 셀렉터) -> 셀렉터의 인자는 '상태(State)'가 됨
  return useStore(wcStoreContext, selector);
};

export const useWcStoreApi = () => {
  const context = useContext(WcStoreContext);
  if (!context)
    throw new Error("useWcStoreApi must be used within WcStoreProvider");
  return context;
};
