import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LenisContext } from '../../hooks/useSmoothScroll';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll provider using Lenis
 * Wraps content and provides smooth scroll functionality
 */
const SmoothScrollProvider = ({
  children,
  enabled = true,
  options = {},
}) => {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!enabled || prefersReducedMotion) {
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      ...options,
    });

    lenisRef.current = lenis;

    // Make available globally for debugging
    if (typeof window !== 'undefined') {
      window.__lenis = lenis;
    }

    // Integrate with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Animation frame loop
    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    // Set ScrollTrigger to use Lenis scroll values
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Refresh ScrollTrigger after Lenis setup
    ScrollTrigger.refresh();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        window.__lenis = null;
      }
    };
  }, [enabled, options]);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
};

export default SmoothScrollProvider;
