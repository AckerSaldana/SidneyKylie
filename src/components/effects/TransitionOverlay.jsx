import { useTransition } from '../../contexts/TransitionContext';
import styles from './TransitionOverlay.module.css';

/**
 * TransitionOverlay - Global circle transition that renders above all routes
 * Uses CSS animations for smooth expansion/contraction effects
 */
const TransitionOverlay = () => {
  const { transitionState } = useTransition();

  if (!transitionState) return null;

  const {
    x,
    y,
    width,
    phase,
    targetX,
    targetY,
    originX,
    originY,
  } = transitionState;

  return (
    <div
      className={`${styles.transitionCircle} ${styles[phase]}`}
      style={{
        '--initial-x': `${x}px`,
        '--initial-y': `${y}px`,
        '--initial-size': `${width}px`,
        '--target-x': `${targetX}px`,
        '--target-y': `${targetY}px`,
        '--origin-x': `${originX || x}px`,
        '--origin-y': `${originY || y}px`,
      }}
      aria-hidden="true"
    />
  );
};

export default TransitionOverlay;
