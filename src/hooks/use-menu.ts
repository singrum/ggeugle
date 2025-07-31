import { useLocation } from "react-router-dom";

export function useMenu(defaultValue = "home") {
  const { pathname } = useLocation();
  return pathname.split("/")[1] || defaultValue;
}
