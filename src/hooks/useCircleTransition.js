import { useState, useCallback } from 'react';

/**
 * Animation phases for circle transition
 */
export const TRANSITION_PHASES = {
  IDLE: null,
  EXPANDING: 'expanding',
  CONTRACTING: 'contracting',
  EXIT_EXPANDING: 'exitExpanding',
  EXIT_CONTRACTING: 'exitContracting',
};

/**
 * Calculate the farthest corner from a point in the viewport
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Object} Target corner coordinates
 */
const getFarthestCorner = (x, y) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const corners = [
    { x: 0, y: 0 },                          // top-left
    { x: viewportWidth, y: 0 },              // top-right
    { x: 0, y: viewportHeight },             // bottom-left
    { x: viewportWidth, y: viewportHeight }, // bottom-right
  ];

  let maxDistance = 0;
  let targetCorner = corners[0];

  corners.forEach(corner => {
    const distance = Math.sqrt(
      Math.pow(corner.x - x, 2) +
      Math.pow(corner.y - y, 2)
    );
    if (distance > maxDistance) {
      maxDistance = distance;
      targetCorner = corner;
    }
  });

  return targetCorner;
};

/**
 * Hook to manage circle expansion transition state
 * @param {Object} options - Configuration options
 * @param {number} options.expandDuration - Duration of expansion phase in ms
 * @param {number} options.contractDelay - Delay before contraction in ms
 * @param {number} options.totalDuration - Total animation duration in ms
 * @returns {Object} Transition state and control functions
 */
export const useCircleTransition = ({
  expandDuration = 400,
  contractDelay = 200,
  totalDuration = 1000,
} = {}) => {
  const [transitionState, setTransitionState] = useState(null);

  /**
   * Start expansion transition from an element
   * @param {HTMLElement} element - Source element (or ref to element)
   * @param {string|number} id - Identifier for the transition
   * @param {Function} onExpanded - Callback when expansion completes
   */
  const startTransition = useCallback((element, id, onExpanded) => {
    const el = element?.current || element;
    if (!el) return;

    // Get element position
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Find farthest corner for expansion target
    const targetCorner = getFarthestCorner(centerX, centerY);

    // Set expanding state
    setTransitionState({
      id,
      x: centerX,
      y: centerY,
      width: rect.width,
      height: rect.height,
      phase: TRANSITION_PHASES.EXPANDING,
      targetX: targetCorner.x,
      targetY: targetCorner.y,
    });

    // After expansion, trigger callback and start contraction
    setTimeout(() => {
      if (onExpanded) onExpanded();

      setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          phase: TRANSITION_PHASES.CONTRACTING,
        }));
      }, contractDelay);
    }, expandDuration);

    // Clear state after full animation
    setTimeout(() => {
      setTransitionState(null);
    }, totalDuration);
  }, [expandDuration, contractDelay, totalDuration]);

  /**
   * Start exit transition (reverse)
   * @param {number} x - Starting X position (e.g., close button)
   * @param {number} y - Starting Y position
   * @param {Function} onContracted - Callback when contraction starts
   */
  const startExitTransition = useCallback((x, y, onContracted) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Set exit expanding state
    setTransitionState({
      id: 'exit',
      x: x || viewportWidth / 2,
      y: y || viewportHeight / 2,
      width: 40, // Close button size
      height: 40,
      phase: TRANSITION_PHASES.EXIT_EXPANDING,
      originX: viewportWidth,
      originY: 0,
      targetX: 0,
      targetY: viewportHeight,
    });

    // After expansion, start contraction
    setTimeout(() => {
      setTransitionState(prev => ({
        ...prev,
        phase: TRANSITION_PHASES.EXIT_CONTRACTING,
      }));

      // Small delay before callback to ensure smooth transition
      setTimeout(() => {
        if (onContracted) onContracted();
      }, 50);
    }, expandDuration);

    // Clear state after full animation
    setTimeout(() => {
      setTransitionState(null);
    }, totalDuration - 200); // Slightly shorter for exit
  }, [expandDuration, totalDuration]);

  /**
   * Cancel any ongoing transition
   */
  const cancelTransition = useCallback(() => {
    setTransitionState(null);
  }, []);

  /**
   * Get CSS custom properties for the transition element
   */
  const getTransitionStyles = useCallback(() => {
    if (!transitionState) return {};

    return {
      '--initial-x': `${transitionState.x}px`,
      '--initial-y': `${transitionState.y}px`,
      '--initial-size': `${transitionState.width}px`,
      '--target-x': `${transitionState.targetX}px`,
      '--target-y': `${transitionState.targetY}px`,
      '--origin-x': `${transitionState.originX || transitionState.x}px`,
      '--origin-y': `${transitionState.originY || transitionState.y}px`,
    };
  }, [transitionState]);

  return {
    // State
    transitionState,
    isTransitioning: transitionState !== null,
    phase: transitionState?.phase || null,

    // Actions
    startTransition,
    startExitTransition,
    cancelTransition,

    // Helpers
    getTransitionStyles,
  };
};

export default useCircleTransition;
