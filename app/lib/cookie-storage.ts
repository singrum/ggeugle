import Cookies from "js-cookie";
import type { StateStorage } from "zustand/middleware";

export // js-cookie를 사용하는 StateStorage 구현
const cookieStorage: StateStorage = {
  getItem: (name) => {
    const value = Cookies.get(name);
    if (!value) return null;

    try {
      return value;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 365 }); // 1년간 쿠키 유지
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};
