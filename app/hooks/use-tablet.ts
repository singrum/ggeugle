import { useMediaQuery } from "./use-media-query";

const TABLET_BREAKPOINT = 1024;

export function useIsTablet() {
  return useMediaQuery(TABLET_BREAKPOINT);
}
