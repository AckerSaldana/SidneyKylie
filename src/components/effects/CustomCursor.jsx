import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../../hooks';

/**
 * Custom cursor with smooth following animation
 * Features:
 * - Smooth follow with GSAP
 * - Hover states for interactive elements
 * - Click animation
 * - Hidden on touch devices
 */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || prefersReducedMotion) return;

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
      }

      // Instant dot position
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0,
      });

      // Smooth cursor follow
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    // Mouse enter/leave viewport
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Click handlers
    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: isHovering ? 1.5 : 1,
        duration: 0.3,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    // Hover detection for interactive elements
    const handleElementHover = (e) => {
      const target = e.target;
      const isInteractive =
        target.matches('a, button, [role="button"], input, textarea, select') ||
        target.closest('a, button, [role="button"]') ||
        target.dataset.cursorHover;

      if (isInteractive) {
        setIsHovering(true);
        gsap.to(cursor, {
          scale: 1.5,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleElementLeave = (e) => {
      const target = e.target;
      const isInteractive =
        target.matches('a, button, [role="button"], input, textarea, select') ||
        target.closest('a, button, [role="button"]') ||
        target.dataset.cursorHover;

      if (isInteractive) {
        setIsHovering(false);
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseout', handleElementLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseout', handleElementLeave);
    };
  }, [isVisible, isHovering, prefersReducedMotion]);

  // Don't render on touch devices or reduced motion
  const isTouchDevice = typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (isTouchDevice || prefersReducedMotion) return null;

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(116, 197, 255, 0.5)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease, border-color 0.3s ease',
          mixBlendMode: 'difference',
          backgroundColor: isHovering ? 'rgba(116, 197, 255, 0.1)' : 'transparent',
        }}
      />
      {/* Center dot */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#74C5FF',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Global cursor hide style */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
