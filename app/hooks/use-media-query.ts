import { useSyncExternalStore } from "react";

export function useMediaQuery(breakPoint: number) {
  return useSyncExternalStore(
    // 1. 구독 로직
    (callback) => {
      const mql = window.matchMedia(`(max-width: ${breakPoint - 1}px)`);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    // 2. 클라이언트 값 가져오기
    () => window.matchMedia(`(max-width: ${breakPoint - 1}px)`).matches,
    // 3. 서버 사이드 기본값 (SSR 시 사용)
    () => false,
  );
}
