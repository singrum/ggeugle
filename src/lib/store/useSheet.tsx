import { createRef } from "react";
import { BottomSheetRef } from "react-spring-bottom-sheet";
import { create } from "zustand";

export interface SheetInfo {
  sheetRef: any;
}

export const useSheet = create<SheetInfo>((set) => ({
  sheetRef: createRef()!,
}));
