import { useMediaQuery } from "./use-media-query";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return useMediaQuery(MOBILE_BREAKPOINT);
}
