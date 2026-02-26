import { createStore } from "zustand/vanilla";
import type { RuleForm } from "~/types/rule";

export type StorageState = {
  ruleForms: RuleForm[];
};

export type StorageActions = {
  addRuleForm: (ruleForm: RuleForm) => void;
  removeRuleForm: (ruleForm: RuleForm) => void;
};

export type StorageStore = StorageState & StorageActions;

export const defaultInitState: StorageState = {
  ruleForms: [],
};

export const createStorageStore = (
  initState: StorageState = defaultInitState,
) => {
  return createStore<StorageStore>()((set) => ({
    ...initState,
    addRuleForm: (ruleForm) =>
      set((state) => ({ ruleForms: [...state.ruleForms, ruleForm] })),
    removeRuleForm: (ruleForm) =>
      set((state) => ({
        ruleForms: state.ruleForms.filter((rf) => rf !== ruleForm),
      })),
  }));
};
