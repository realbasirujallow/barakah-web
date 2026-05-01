import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {}
      }

      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => onStoreChange()
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    () =>
      typeof window !== "undefined"
        ? window.innerWidth < MOBILE_BREAKPOINT
        : false,
    () => false,
  )
}
