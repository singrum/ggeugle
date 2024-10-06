import { createRef } from "react";
import { create } from "zustand";

export interface SheetInfo {
  sheetRef: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useSheet = create<SheetInfo>((set) => ({
  sheetRef: createRef()!,
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));
