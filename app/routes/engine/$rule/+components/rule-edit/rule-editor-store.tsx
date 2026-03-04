// src/stores/counter-store.ts
import { cloneDeep } from "lodash-es";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";
import type { RuleForm } from "~/types/rule";

export type RuleEditorState = {
  ruleForm: RuleForm;
  localRuleForm: RuleForm;
  isSample: boolean;
  menu: number;
  ruleJsonInputValue: string;
  isValidJson: boolean;
};

export type RuleEditorActions = {
  setMenu: (menu: number) => void;
  initRuleJsonInputValue: () => void;
  setRuleJsonInputValue: (value: string) => void;
  restoreLocalRuleForm: () => void;
};

export type RuleEditorStore = RuleEditorState & RuleEditorActions;

export const createRuleEditorStore = (initState: RuleEditorState) => {
  return createStore<RuleEditorStore>()(
    immer((set, get) => ({
      ...initState,

      setMenu: (menu: number) => set((state) => ({ ...state, menu })),
      initRuleJsonInputValue: () => {
        const { localRuleForm } = get();

        set({
          ruleJsonInputValue: JSON.stringify(localRuleForm.content, null, 2),
          isValidJson: true,
        });
      },

      setRuleJsonInputValue: (value: string) => {
        try {
          const parsed = JSON.parse(value);

          set({
            isValidJson: true,
            ruleJsonInputValue: value,
            localRuleForm: { ...get().localRuleForm, content: parsed },
          });
        } catch (e) {
          set({
            isValidJson: false,
            ruleJsonInputValue: value,
          });
        }
      },
      restoreLocalRuleForm: () => {
        const { ruleForm } = get();
        set({
          localRuleForm: cloneDeep(ruleForm),
          ruleJsonInputValue: JSON.stringify(ruleForm.content, null, 2),
          isValidJson: true,
        });
      },
    })),
  );
};
