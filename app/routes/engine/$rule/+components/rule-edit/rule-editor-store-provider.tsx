"use client";

import { cloneDeep } from "lodash-es";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import type { RuleForm } from "~/types/rule";
import {
  createRuleEditorStore,
  type RuleEditorStore,
} from "./rule-editor-store";

export type RuleEditorStoreApi = ReturnType<typeof createRuleEditorStore>;

export const RuleEditorContext = createContext<RuleEditorStoreApi | undefined>(
  undefined,
);

export interface RuleEditorStoreProviderProps {
  ruleForm: RuleForm;
  isSample: boolean;
  children: ReactNode;
}

export const RuleEditorStoreProvider = ({
  children,
  ruleForm,
  isSample,
}: RuleEditorStoreProviderProps) => {
  const [store] = useState(() =>
    createRuleEditorStore({
      ruleForm,
      isSample,
      localRuleForm: cloneDeep(ruleForm),
      ruleJsonInputValue: JSON.stringify(ruleForm, null, 2),
      menu: 0,
      isValidJson: true,
    }),
  );
  return (
    <RuleEditorContext.Provider value={store}>
      {children}
    </RuleEditorContext.Provider>
  );
};

export const useRuleEditorStore = <T,>(
  selector: (store: RuleEditorStore) => T,
): T => {
  const ruleEditorStoreContext = useContext(RuleEditorContext);
  if (!ruleEditorStoreContext) {
    throw new Error(
      `useRuleEditorStore must be used within RuleEditorStoreProvider`,
    );
  }

  return useStore(ruleEditorStoreContext, selector);
};

export const useRuleEditorStoreApi = () => {
  const context = useContext(RuleEditorContext);
  if (!context) throw new Error("...");
  return context;
};
