import { create } from "zustand";

export interface refsInfo {
  inputRef: HTMLInputElement | undefined;
  setInputRef: (inputRef: HTMLInputElement) => void;
}

export const useRefs = create<refsInfo>((set) => ({
  inputRef: undefined,
  setInputRef: (inputRef: HTMLInputElement) => {
    set({ inputRef });
  },
}));
