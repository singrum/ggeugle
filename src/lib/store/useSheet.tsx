import { createRef } from "react";
import { create } from "zustand";

export interface SheetInfo {
  sheetRef: any;
}

export const useSheet = create<SheetInfo>(() => ({
  sheetRef: createRef()!,
}));
