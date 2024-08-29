import Cookies from "js-cookie";
import { create } from "zustand";

export interface CookieSettingsInfo {
  // 단어 클릭시 자동 금지단어 추가
  isAutoExcept: boolean;
  setIsAutoExcept: (isAutoExcept: boolean) => void;

  // 검색 레이아웃 좌우 반전
  isSearchFlip: boolean;
  setIsSearchFlip: (isSearchFlip: boolean) => void;

  // toaster 표시
  showToast: boolean;
  setShowToast: (showToast: boolean) => void;

  // 단어 제외 방법
  exceptBy: "space" | "enter";
  setExceptBy: (exceptBy: "space" | "enter") => void;
}

export const useCookieSettings = create<CookieSettingsInfo>((set) => ({
  isAutoExcept: Cookies.get("auto-except") === "true" ? true : false,
  setIsAutoExcept: (isAutoExcept: boolean) => {
    Cookies.set("auto-except", `${isAutoExcept}`);
    set({ isAutoExcept });
  },

  isSearchFlip: Cookies.get("search-flip") === "true" ? true : false,
  setIsSearchFlip: (isSearchFlip: boolean) => {
    Cookies.set("search-flip", `${isSearchFlip}`);
    set({ isSearchFlip });
  },

  showToast: Cookies.get("show-toast") === "false" ? false : true,
  setShowToast: (showToast: boolean) => {
    Cookies.set("show-toast", `${showToast}`);
    set({ showToast });
  },

  exceptBy: Cookies.get("exceptBy") === "enter" ? "enter" : "space",
  setExceptBy: (exceptBy: "enter" | "space") => {
    Cookies.set("exceptBy", `${exceptBy}`);
    set({ exceptBy });
  },
}));
