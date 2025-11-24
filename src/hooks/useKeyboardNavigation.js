import { useEffect, useCallback } from 'react';

/**
 * Hook to handle keyboard navigation between sections
 * @param {Object} options - Configuration options
 * @param {number} options.currentIndex - Current section index
 * @param {number} options.maxIndex - Maximum section index
 * @param {Function} options.onChange - Callback when index changes
 * @param {boolean} options.enabled - Whether to enable keyboard navigation
 * @param {boolean} options.loop - Whether to loop around at boundaries
 */
export const useKeyboardNavigation = ({
  currentIndex,
  maxIndex,
  onChange,
  enabled = true,
  loop = false,
} = {}) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Ignore if user is typing in an input
    const tagName = event.target.tagName.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tagName)) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < maxIndex) {
          onChange(currentIndex + 1);
        } else if (loop) {
          onChange(0);
        }
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          onChange(currentIndex - 1);
        } else if (loop) {
          onChange(maxIndex);
        }
        break;

      case 'Home':
        event.preventDefault();
        onChange(0);
        break;

      case 'End':
        event.preventDefault();
        onChange(maxIndex);
        break;

      default:
        break;
    }
  }, [currentIndex, maxIndex, onChange, enabled, loop]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

/**
 * Hook to handle number key navigation (1-9)
 * @param {Function} onChange - Callback when section is selected
 * @param {number} maxSections - Maximum number of sections
 * @param {boolean} enabled - Whether to enable number key navigation
 */
export const useNumberKeyNavigation = ({
  onChange,
  maxSections,
  enabled = true,
} = {}) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Ignore if user is typing in an input
    const tagName = event.target.tagName.toLowerCase();
    if (['input', 'textarea', 'select'].includes(tagName)) return;

    // Check for number keys 1-9
    const num = parseInt(event.key, 10);
    if (!isNaN(num) && num >= 1 && num <= maxSections) {
      event.preventDefault();
      onChange(num - 1); // Convert to 0-based index
    }
  }, [onChange, maxSections, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

export default useKeyboardNavigation;
