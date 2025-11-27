import { createContext, useContext, useState, useCallback, useRef } from 'react';

const TransitionContext = createContext(null);

/**
 * TransitionProvider - Global state manager for circle page transitions
 * Wraps the Router to persist transition state across route changes
 */
export const TransitionProvider = ({ children }) => {
  const [transitionState, setTransitionState] = useState(null);
  const isExitingRef = useRef(false);

  /**
   * Start an expanding circle transition from an element
   * @param {HTMLElement} element - The element to expand from (e.g., project thumbnail)
   * @param {string} targetRoute - The route to navigate to after expansion
   */
  const startTransition = useCallback((element, targetRoute) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Find farthest corner for optimal expansion
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const corners = [
      { x: 0, y: 0 },
      { x: viewportWidth, y: 0 },
      { x: 0, y: viewportHeight },
      { x: viewportWidth, y: viewportHeight },
    ];

    let maxDistance = 0;
    let targetCorner = corners[0];

    corners.forEach((corner) => {
      const distance = Math.sqrt(
        Math.pow(corner.x - centerX, 2) + Math.pow(corner.y - centerY, 2)
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        targetCorner = corner;
      }
    });

    isExitingRef.current = false;
    setTransitionState({
      phase: 'expanding',
      x: centerX,
      y: centerY,
      width: rect.width,
      targetRoute,
      targetX: targetCorner.x,
      targetY: targetCorner.y,
    });
  }, []);

  /**
   * Trigger the reveal animation (circle contracts to reveal new page)
   * Called by the destination page component after mounting OR by RouteChangeHandler
   */
  const triggerReveal = useCallback(() => {
    setTransitionState((prev) => {
      if (!prev) return null;
      // Use exitContracting for exit flow, contracting for entry flow
      const newPhase = isExitingRef.current ? 'exitContracting' : 'contracting';
      return { ...prev, phase: newPhase };
    });

    // Clear transition state after animation completes
    setTimeout(() => {
      setTransitionState(null);
      isExitingRef.current = false;
    }, 400);
  }, []);

  /**
   * Start exit transition (for navigating back or to another project)
   * @param {number} x - X coordinate to start from
   * @param {number} y - Y coordinate to start from
   * @param {string} targetRoute - The route to navigate to
   */
  const startExitTransition = useCallback((x, y, targetRoute) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    isExitingRef.current = true;
    setTransitionState({
      phase: 'exitExpanding',
      x: x || viewportWidth / 2,
      y: y || viewportHeight / 2,
      width: 40,
      targetRoute,
      originX: viewportWidth,
      originY: 0,
      targetX: 0,
      targetY: viewportHeight,
    });
  }, []);

  /**
   * Check if there's an active transition that needs reveal
   */
  const needsReveal = useCallback(() => {
    return transitionState &&
      (transitionState.phase === 'expanding' || transitionState.phase === 'exitExpanding');
  }, [transitionState]);

  /**
   * Clear transition state immediately
   */
  const clearTransition = useCallback(() => {
    setTransitionState(null);
    isExitingRef.current = false;
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        transitionState,
        startTransition,
        triggerReveal,
        startExitTransition,
        clearTransition,
        needsReveal,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

/**
 * Hook to access transition context
 */
export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
};

export default TransitionContext;
