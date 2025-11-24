/**
 * Animation easing functions
 * Centralized easing curves for consistent animations
 */

// CSS cubic-bezier values
export const easings = {
  // Standard material design easing
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Smooth, natural feeling transitions
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',

  // Dramatic, attention-grabbing transitions
  dramatic: 'cubic-bezier(0.76, 0, 0.24, 1)',

  // Soft bounce effect
  bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

  // Expo ease out - fast start, slow end
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Circ ease out
  outCirc: 'cubic-bezier(0, 0.55, 0.45, 1)',

  // Quint ease out
  outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',

  // Back ease out (slight overshoot)
  outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Linear (no easing)
  linear: 'linear',
};

// GSAP-compatible easing strings
export const gsapEasings = {
  standard: 'power2.out',
  smooth: 'power2.inOut',
  dramatic: 'power4.inOut',
  bounce: 'back.out(1.7)',
  outExpo: 'expo.out',
  outCirc: 'circ.out',
  outQuint: 'quint.out',
  outBack: 'back.out(1.5)',
  linear: 'none',

  // Additional GSAP easings
  elastic: 'elastic.out(1, 0.3)',
  slowMo: 'slow(0.7, 0.7, false)',
};

// Numeric values for JavaScript calculations
export const easingFunctions = {
  // Quadratic ease out
  easeOutQuad: (t) => t * (2 - t),

  // Cubic ease out
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),

  // Quart ease out
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),

  // Quint ease out
  easeOutQuint: (t) => 1 - Math.pow(1 - t, 5),

  // Expo ease out
  easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),

  // Circ ease out
  easeOutCirc: (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),

  // Back ease out
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // Elastic ease out
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  // Linear interpolation
  lerp: (start, end, t) => start + (end - start) * t,
};

export default easings;
