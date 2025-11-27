import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for detecting when an element enters the viewport
 * Uses IntersectionObserver for reliable, performant detection
 *
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @param {boolean} options.triggerOnce - Only trigger once (default: true)
 * @returns {[React.RefObject, boolean]} - Ref to attach and visibility state
 */
export const useInView = (options = {}) => {
  const {
    threshold = 0.2,
    rootMargin = '-50px 0px',
    triggerOnce = true,
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and triggerOnce is true, don't observe
    if (hasTriggered && triggerOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            setHasTriggered(true);
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return [ref, isInView];
};

/**
 * Hook for staggered reveal animations on multiple elements
 * Returns a callback ref generator for each child element
 *
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold
 * @param {string} options.rootMargin - Root margin
 * @param {number} options.staggerDelay - Delay between items in ms
 * @returns {Object} - { containerRef, isContainerInView, getItemProps }
 */
export const useStaggeredReveal = (options = {}) => {
  const {
    threshold = 0.15,
    rootMargin = '-30px 0px',
    staggerDelay = 100,
  } = options;

  const [containerRef, isContainerInView] = useInView({ threshold, rootMargin });

  const getItemProps = useCallback((index) => ({
    style: { '--index': index, '--stagger-delay': `${index * staggerDelay}ms` },
    className: isContainerInView ? 'visible' : '',
  }), [isContainerInView, staggerDelay]);

  return {
    containerRef,
    isContainerInView,
    getItemProps,
  };
};

export default useInView;
