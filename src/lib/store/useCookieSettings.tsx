import Cookies from "js-cookie";
import { create } from "zustand";

export interface CookieSettingsInfo {
  // 검색 레이아웃 좌우 반전
  isSearchFlip: boolean;
  setIsSearchFlip: (isSearchFlip: boolean) => void;

  // toaster 표시
  showToast: boolean;
  setShowToast: (showToast: boolean) => void;

  // 모든 단어 항상 펼치기
  showAllWords: boolean;
  setShowAllWords: (showAllWords: boolean) => void;

  // 단어 제외 방법
  exceptBy: "space" | "enter";
  setExceptBy: (exceptBy: "space" | "enter") => void;
}

export const useCookieSettings = create<CookieSettingsInfo>((set) => ({
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

  showAllWords: Cookies.get("show-all-words") === "true" ? true : false,
  setShowAllWords: (showAllWords: boolean) => {
    Cookies.set("show-all-words", `${showAllWords}`);
    set({ showAllWords });
  },

  exceptBy: Cookies.get("exceptBy") === "enter" ? "enter" : "space",
  setExceptBy: (exceptBy: "enter" | "space") => {
    Cookies.set("exceptBy", `${exceptBy}`);
    set({ exceptBy });
  },
}));
