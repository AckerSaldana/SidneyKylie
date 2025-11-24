import { useContext, createContext } from 'react';

// Create context for Lenis instance
export const LenisContext = createContext(null);

/**
 * Hook to access Lenis instance from context
 */
export const useSmoothScroll = () => {
  const lenis = useContext(LenisContext);

  const scrollTo = (target, options = {}) => {
    if (lenis) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options,
      });
    }
  };

  const stop = () => lenis?.stop();
  const start = () => lenis?.start();

  return { lenis, scrollTo, stop, start };
};

export default useSmoothScroll;
