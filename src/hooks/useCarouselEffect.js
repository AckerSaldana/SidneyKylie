import { useEffect, useCallback } from 'react';

/**
 * Hook to apply vertical carousel effect to items based on scroll position
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.containerRef - Reference to scroll container
 * @param {string} options.itemSelector - CSS selector for carousel items
 * @param {boolean} options.enabled - Whether to enable the effect
 * @param {Object} options.config - Effect configuration
 */
export const useCarouselEffect = ({
  containerRef,
  itemSelector = '[data-project-item]',
  enabled = true,
  config = {}
} = {}) => {
  const {
    scaleRange = 0.05,      // How much to scale (0.05 = 5%)
    opacityRange = 0.2,     // How much opacity changes (0.2 = 20%)
    blurRange = 0,          // Max blur in pixels
    perspective = false,    // Enable 3D perspective effect
    rotateYRange = 0,       // Max Y rotation in degrees
  } = config;

  const applyCarouselEffect = useCallback(() => {
    const container = containerRef?.current;
    if (!container || !enabled) return;

    const items = container.querySelectorAll(itemSelector);
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.height / 2;

    items.forEach((item) => {
      // Skip items with hover state
      if (item.matches(':hover')) return;

      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2 - containerRect.top;
      const distance = itemCenter - containerCenter;
      const maxDistance = containerRect.height / 2;

      // Normalize distance (-1 to 1)
      const normalizedDistance = Math.max(-1, Math.min(1, distance / maxDistance));
      const absDistance = Math.abs(normalizedDistance);

      // Only apply to visible items
      if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
        // Calculate effect values
        const scale = 1 - (absDistance * scaleRange);
        const opacity = 1 - (absDistance * opacityRange);
        const blur = absDistance * blurRange;
        const rotateY = perspective ? normalizedDistance * rotateYRange : 0;

        // Build transform string
        let transform = `scale(${scale})`;
        if (rotateY !== 0) {
          transform += ` rotateY(${rotateY}deg)`;
        }

        // Apply styles
        item.style.transform = transform;
        item.style.opacity = opacity;
        if (blur > 0) {
          item.style.filter = `blur(${blur}px)`;
        }
      }
    });
  }, [containerRef, itemSelector, enabled, scaleRange, opacityRange, blurRange, perspective, rotateYRange]);

  // Reset effect on items (for hover state)
  const resetItemEffect = useCallback((item) => {
    if (!item) return;
    item.style.transform = 'scale(1)';
    item.style.opacity = '1';
    item.style.filter = 'none';
  }, []);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container || !enabled) return;

    // Apply initial effect
    applyCarouselEffect();

    // Add scroll listener
    container.addEventListener('scroll', applyCarouselEffect, { passive: true });

    // Add hover listeners to reset effect on hover
    const items = container.querySelectorAll(itemSelector);
    const handleMouseEnter = (e) => resetItemEffect(e.currentTarget);
    const handleMouseLeave = () => applyCarouselEffect();

    items.forEach(item => {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      container.removeEventListener('scroll', applyCarouselEffect);
      items.forEach(item => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [containerRef, itemSelector, enabled, applyCarouselEffect, resetItemEffect]);

  return {
    applyEffect: applyCarouselEffect,
    resetItem: resetItemEffect,
  };
};

export default useCarouselEffect;
