/**
 * Animation timing constants
 * Centralized duration values for consistent animations
 */

// Duration values in milliseconds
export const timings = {
  // Instant feedback (hover states, focus)
  instant: 150,

  // Fast transitions (small UI elements)
  fast: 300,

  // Normal transitions (buttons, cards)
  normal: 400,

  // Slow transitions (modals, large elements)
  slow: 600,

  // Page transitions
  page: 800,

  // Very slow (splash screens, loading)
  verySlow: 1000,

  // Ambient animations (floating, pulsing)
  ambient: 2000,

  // Long ambient (background effects)
  longAmbient: 4000,
};

// Duration values in seconds (for GSAP)
export const timingsSeconds = {
  instant: 0.15,
  fast: 0.3,
  normal: 0.4,
  slow: 0.6,
  page: 0.8,
  verySlow: 1,
  ambient: 2,
  longAmbient: 4,
};

// Stagger values for sequential animations
export const staggers = {
  // Very fast stagger
  tight: 0.02,

  // Normal stagger for lists
  normal: 0.05,

  // Relaxed stagger for larger items
  relaxed: 0.1,

  // Wide stagger for dramatic effect
  wide: 0.15,

  // Character animation stagger
  character: 0.03,

  // Word animation stagger
  word: 0.08,

  // Line animation stagger
  line: 0.12,
};

// Delay values for animation choreography
export const delays = {
  // No delay
  none: 0,

  // Micro delay
  micro: 100,

  // Short delay
  short: 200,

  // Medium delay
  medium: 400,

  // Long delay
  long: 600,

  // Page load delay
  pageLoad: 300,

  // After transition delay
  afterTransition: 800,
};

// CSS custom property references
export const cssTimings = {
  instant: 'var(--duration-instant)',
  fast: 'var(--duration-fast)',
  normal: 'var(--duration-normal)',
  slow: 'var(--duration-slow)',
  page: 'var(--duration-page)',
  ambient: 'var(--duration-ambient)',
};

export default timings;
