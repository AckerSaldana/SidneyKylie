import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import styles from '../../styles/LandingPage.module.css';
import { useReducedMotion } from '../../hooks';

/**
 * Hero section with video background and GSAP animations
 */
const HeroSection = ({ onNavigateToProjects }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const decoration1Ref = useRef(null);
  const decoration2Ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Main timeline for hero entrance
      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      // Get all letter elements
      const titleLetters = titleRef.current?.querySelectorAll(`.${styles.floatingLetter}`);
      const subtitleLetters = subtitleRef.current?.querySelectorAll(`.${styles.floatingLetter}`);

      // Set initial states
      gsap.set([titleLetters, subtitleLetters], {
        opacity: 0,
        y: 60,
        rotateX: -90,
      });

      gsap.set(descriptionRef.current, {
        opacity: 0,
        y: 30,
      });

      gsap.set(ctaRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.95,
      });

      gsap.set([decoration1Ref.current, decoration2Ref.current], {
        opacity: 0,
        scale: 0.8,
      });

      // Animate title letters with stagger
      tl.to(titleLetters, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: {
          each: 0.08,
          from: 'start',
        },
      }, 0.3);

      // Animate subtitle letters
      tl.to(subtitleLetters, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: {
          each: 0.08,
          from: 'start',
        },
      }, 0.6);

      // Animate description
      tl.to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 1);

      // Animate CTA button
      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
      }, 1.2);

      // Animate decorations
      tl.to(decoration1Ref.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, 0.8);

      tl.to(decoration2Ref.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, 1);

      // Floating animation for decorations (continuous)
      gsap.to(decoration1Ref.current, {
        y: -15,
        rotation: 3,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to(decoration2Ref.current, {
        y: 10,
        rotation: -2,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Handle CTA hover animation
  const handleCtaHover = (isHovering) => {
    if (prefersReducedMotion) return;

    gsap.to(ctaRef.current, {
      scale: isHovering ? 1.05 : 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${styles.heroSection}`}
    >
      {/* Video de fondo */}
      <video
        className={styles.heroVideo}
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-poster.jpg"
      >
        <source src="/video/background-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay para mejorar legibilidad del texto */}
      <div className={styles.videoOverlay} />

      <div className={styles.heroContent}>
        <h2 className={styles.heroTitle}>
          <span ref={titleRef}>
            {'Sidney'.split('').map((letter, index) => (
              <span
                key={index}
                className={styles.floatingLetter}
              >
                {letter}
              </span>
            ))}
          </span>
          <span className={styles.heroSubtitle} ref={subtitleRef}>
            {'Kylie'.split('').map((letter, index) => (
              <span
                key={index}
                className={styles.floatingLetter}
              >
                {letter}
              </span>
            ))}
          </span>
        </h2>
        <p ref={descriptionRef} className={styles.heroDescription}>
          Diseñando espacios con propósito. Arquitectura interior que une
          sensibilidad, sustentabilidad y experiencia vivida.
        </p>
        <button
          ref={ctaRef}
          onClick={onNavigateToProjects}
          className={styles.ctaButton}
          onMouseEnter={() => handleCtaHover(true)}
          onMouseLeave={() => handleCtaHover(false)}
        >
          VER PROYECTOS
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Decoración geométrica */}
      <div ref={decoration1Ref} className={styles.decoration1} />
      <div ref={decoration2Ref} className={styles.decoration2} />
    </section>
  );
};

export default HeroSection;
