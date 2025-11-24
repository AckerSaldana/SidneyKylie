import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to track scroll progress within a container or window
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.containerRef - Reference to scroll container (uses window if not provided)
 * @param {number} options.threshold - Scroll threshold before triggering updates
 * @param {boolean} options.enabled - Whether to enable scroll tracking
 * @returns {Object} Scroll state object
 */
export const useScrollProgress = ({
  containerRef = null,
  threshold = 0,
  enabled = true
} = {}) => {
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    scrollX: 0,
    progress: 0,
    direction: 'down',
    isScrolling: false,
    atTop: true,
    atBottom: false,
  });

  const handleScroll = useCallback(() => {
    const container = containerRef?.current;

    let scrollTop, scrollLeft, scrollHeight, clientHeight;

    if (container) {
      scrollTop = container.scrollTop;
      scrollLeft = container.scrollLeft;
      scrollHeight = container.scrollHeight;
      clientHeight = container.clientHeight;
    } else {
      scrollTop = window.scrollY;
      scrollLeft = window.scrollX;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    }

    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

    setScrollState(prev => ({
      scrollY: scrollTop,
      scrollX: scrollLeft,
      progress,
      direction: scrollTop > prev.scrollY ? 'down' : 'up',
      isScrolling: true,
      atTop: scrollTop <= threshold,
      atBottom: scrollTop >= maxScroll - threshold,
    }));
  }, [containerRef, threshold]);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef?.current;
    const scrollElement = container || window;

    // Initial scroll position
    handleScroll();

    // Debounced scroll end detection
    let scrollTimeout;
    const handleScrollWithEnd = () => {
      handleScroll();

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollState(prev => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    scrollElement.addEventListener('scroll', handleScrollWithEnd, { passive: true });

    return () => {
      scrollElement.removeEventListener('scroll', handleScrollWithEnd);
      clearTimeout(scrollTimeout);
    };
  }, [containerRef, enabled, handleScroll]);

  return scrollState;
};

/**
 * Hook to calculate title progress for sticky scroll effect
 * @param {number} scrollY - Current scroll position
 * @param {number} windowHeight - Window/container height
 * @returns {number} Progress value between 0 and 1
 */
export const useTitleProgress = (scrollY, windowHeight = null) => {
  const height = windowHeight || (typeof window !== 'undefined' ? window.innerHeight : 1000);
  return Math.min(Math.max(scrollY / height, 0), 1);
};

export default useScrollProgress;
