import * as React from "react";

export function useMediaQuery(breakPoint: number) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakPoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakPoint);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakPoint);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
