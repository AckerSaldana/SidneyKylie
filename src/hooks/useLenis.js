import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for Lenis smooth scroll with GSAP ScrollTrigger integration
 * @param {Object} options - Lenis configuration options
 * @param {boolean} enabled - Whether smooth scroll is enabled
 * @returns {Object} - Lenis instance ref
 */
export const useLenis = (options = {}, enabled = true) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize Lenis with default options
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      ...options,
    });

    lenisRef.current = lenis;

    // Integrate with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for smooth animation frame updates
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's default lag smoothing for Lenis
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(lenis.raf);
    };
  }, [enabled, options]);

  return lenisRef;
};

/**
 * Hook to access the global Lenis instance
 * Use this in child components that need to control scroll
 */
export const useLenisScroll = () => {
  const scrollTo = (target, options = {}) => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(target, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options,
      });
    }
  };

  const stop = () => {
    const lenis = window.__lenis;
    if (lenis) lenis.stop();
  };

  const start = () => {
    const lenis = window.__lenis;
    if (lenis) lenis.start();
  };

  return { scrollTo, stop, start };
};

export default useLenis;
