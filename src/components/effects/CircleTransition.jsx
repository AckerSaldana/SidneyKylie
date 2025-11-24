import React from 'react';
import styles from '../../styles/LandingPage.module.css';

/**
 * Circle expansion transition overlay
 * Used for page transitions when opening/closing projects
 */
const CircleTransition = ({ transitionState }) => {
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
      className={`${styles.expandingCircle} ${styles[phase]}`}
      style={{
        '--initial-x': `${x}px`,
        '--initial-y': `${y}px`,
        '--initial-size': `${width}px`,
        '--target-x': `${targetX}px`,
        '--target-y': `${targetY}px`,
        '--origin-x': `${originX || x}px`,
        '--origin-y': `${originY || y}px`,
        zIndex: 10000, // Ensure it's above everything
      }}
      aria-hidden="true"
    />
  );
};

export default CircleTransition;
