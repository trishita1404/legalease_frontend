import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize state based on the actual media query status
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
    }
    return false
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(mql.matches)
    }

    mql.addEventListener("change", onChange)
    
    // We no longer call setIsMobile(window.innerWidth...) here 
    // because the initial state is already set correctly above.

    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}