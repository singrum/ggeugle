import { useMemo } from "react";
import { useLocation } from "react-router";

export function useSecondPath() {
  const location = useLocation();
  return useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[1] || "";
  }, [location.pathname]);
}
