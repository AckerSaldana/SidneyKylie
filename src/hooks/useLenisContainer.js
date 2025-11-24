import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

/**
 * Container-specific Lenis smooth scroll hook
 * Creates buttery smooth scrolling with inertia for a specific container element
 *
 * @param {Object} options
 * @param {React.RefObject} options.containerRef - Ref to the scrollable container
 * @param {boolean} options.enabled - Whether smooth scroll is enabled (default: true)
 * @param {Function} options.onScroll - Callback fired on each scroll frame
 * @param {number} options.duration - Scroll inertia duration (default: 1.4 for premium feel)
 * @param {number} options.wheelMultiplier - Mouse wheel sensitivity (default: 0.8 for elegance)
 * @returns {Object} - { lenis: Lenis instance, scrollTo: function }
 */
export const useLenisContainer = ({
  containerRef,
  enabled = true,
  onScroll,
  duration = 1.4,
  wheelMultiplier = 0.8,
}) => {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  // Custom easing function for ultra-smooth feel
  const easing = useCallback((t) => {
    // Custom bezier approximation for buttery smooth deceleration
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }, []);

  useEffect(() => {
    if (!enabled || !containerRef?.current) {
      // Clean up if disabled
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const container = containerRef.current;

    // Initialize Lenis for the specific container
    const lenis = new Lenis({
      wrapper: container,
      content: container.firstElementChild,
      duration,
      easing,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier,
      touchMultiplier: 1.5,
      infinite: false,
      // Prevent Lenis from interfering with horizontal scroll
      syncTouch: false,
      syncTouchLerp: 0.075,
    });

    lenisRef.current = lenis;

    // Scroll event handler
    if (onScroll) {
      lenis.on('scroll', (e) => {
        onScroll(e);
      });
    }

    // RAF loop for smooth updates
    const raf = (time) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, containerRef, duration, wheelMultiplier, easing, onScroll]);

  // Programmatic scroll function
  const scrollTo = useCallback((target, options = {}) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: 0,
        duration: duration,
        easing,
        ...options,
      });
    }
  }, [duration, easing]);

  // Stop/start controls
  const stop = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  }, []);

  const start = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  }, []);

  return {
    lenis: lenisRef.current,
    scrollTo,
    stop,
    start,
  };
};

export default useLenisContainer;
