import { useLocation } from "react-router";

export function usePathSegments() {
  const location = useLocation();
  // location.pathname은 "/home/products/electronics"
  // 앞뒤 슬래시 제거하고 '/'로 split
  return location.pathname
    .replace(/^\/|\/$/g, "") // 양쪽 끝 슬래시 제거
    .split("/")
    .filter(Boolean); // 빈 문자열 제거
}
