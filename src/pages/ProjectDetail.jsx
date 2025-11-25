import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import styles from '../styles/ProjectDetail.module.css';
import { useReducedMotion } from '../hooks';
import { SplitText } from '../utils/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Data
import { getProjectById } from '../data/projects';

const ProjectDetail = ({ projectId: propProjectId, onClose: propOnClose, isModal = false }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = propProjectId || paramId;
  const [scrollY, setScrollY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Refs for horizontal scroll galleries (native CSS scroll)
  const rendersTrackRef = useRef(null);
  const photosTrackRef = useRef(null);

  // Progress state for galleries
  const [rendersProgress, setRendersProgress] = useState(0);
  const [photosProgress, setPhotosProgress] = useState(0);
  const [currentRenderIndex, setCurrentRenderIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Text refs for SplitText animations
  const conceptTextRef = useRef(null);
  const splitTextInstancesRef = useRef([]);

  // Get project data from centralized source
  const project = getProjectById(id) || getProjectById(1);

  // Transform project data for display
  const displayProject = project ? {
    id: project.id,
    number: project.number,
    title: project.title.toUpperCase(),
    category: project.category,
    year: project.year,
    location: project.location,
    area: project.area || project.size,
    client: project.client,
    status: project.status,
    description: project.fullDescription || project.description,
    concept: project.concept,
    mainImage: project.mainImage || project.image,
    renders: project.renders || [],
    photos: project.photos || [],
    plans: project.plans || [],
    specs: project.specs || [],
  } : null;

  // Scroll tracking
  useEffect(() => {
    let scrollElement = window;

    if (isModal && containerRef.current) {
      scrollElement = containerRef.current;
    } else {
      document.documentElement.style.overflow = 'visible';
      document.documentElement.style.height = 'auto';
      document.body.style.overflow = 'visible';
      document.body.style.height = 'auto';
    }

    const handleScroll = () => {
      if (isModal && containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      } else {
        setScrollY(window.scrollY);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      if (!isModal) {
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.overflow = '';
        document.body.style.height = '';
      }
    };
  }, [isModal]);

  // Lenis smooth scroll initialization
  useEffect(() => {
    if (prefersReducedMotion) return;

    const easing = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    let lenis;

    if (isModal && containerRef.current) {
      lenis = new Lenis({
        wrapper: containerRef.current,
        content: containerRef.current.firstElementChild,
        duration: 1.6,
        easing,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.7,
        touchMultiplier: 1.5,
        infinite: false,
      });
    } else {
      lenis = new Lenis({
        duration: 1.6,
        easing,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.7,
        touchMultiplier: 1.5,
        infinite: false,
      });
    }

    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    lenis.on('scroll', ({ scroll }) => {
      setScrollY(scroll);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isModal, prefersReducedMotion]);

  // Native scroll handlers for horizontal galleries
  const handleRendersScroll = useCallback((e) => {
    const track = e.target;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setRendersProgress(progress);

    // Calculate current index based on scroll position
    const itemWidth = clientWidth * 0.75 + 32; // 75vw + gap
    const index = Math.round(scrollLeft / itemWidth);
    setCurrentRenderIndex(Math.min(index, displayProject?.renders?.length - 1 || 0));
  }, [displayProject?.renders?.length]);

  const handlePhotosScroll = useCallback((e) => {
    const track = e.target;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setPhotosProgress(progress);

    // Calculate current index
    const itemWidth = clientWidth * 0.75 + 32;
    const index = Math.round(scrollLeft / itemWidth);
    setCurrentPhotoIndex(Math.min(index, displayProject?.photos?.length - 1 || 0));
  }, [displayProject?.photos?.length]);

  // Gallery navigation functions
  const scrollGallery = useCallback((trackRef, direction, itemCount) => {
    const track = trackRef.current;
    if (!track) return;

    const { clientWidth, scrollLeft, scrollWidth } = track;
    const itemWidth = clientWidth * 0.75 + 32;
    const currentIndex = Math.round(scrollLeft / itemWidth);
    const newIndex = Math.max(0, Math.min(itemCount - 1, currentIndex + direction));

    track.scrollTo({
      left: newIndex * itemWidth,
      behavior: 'smooth'
    });
  }, []);

  // GSAP scroll-linked animations with scrub for smooth slide-in panels
  // Using useLayoutEffect to prevent Flash of Unstyled Content (FOUC)
  useLayoutEffect(() => {
    if (prefersReducedMotion || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const scrollerConfig = isModal ? { scroller: containerRef.current } : {};

        // =========================================
        // CONCEPT PANEL - Slide up and fade in with scrub
        // =========================================
        const conceptPanel = contentRef.current.querySelector(`.${styles.conceptPanel}`);
        if (conceptPanel) {
          // Panel slides up smoothly as you scroll
          gsap.fromTo(conceptPanel,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: conceptPanel,
                start: 'top bottom',
                end: 'top 20%',
                scrub: 0.8,
                ...scrollerConfig,
              },
            }
          );

          // Content elements animate with stagger
          const conceptText = conceptPanel.querySelector(`.${styles.conceptText}`);
          const openingLabel = conceptPanel.querySelector(`.${styles.openingLabel}`);
          const infoItems = conceptPanel.querySelectorAll(`.${styles.infoItem}`);

          if (openingLabel) {
            gsap.fromTo(openingLabel,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: conceptPanel,
                  start: 'top 60%',
                  end: 'top 30%',
                  scrub: 0.5,
                  ...scrollerConfig,
                },
              }
            );
          }

          if (conceptText) {
            gsap.fromTo(conceptText,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: conceptPanel,
                  start: 'top 55%',
                  end: 'top 25%',
                  scrub: 0.6,
                  ...scrollerConfig,
                },
              }
            );
          }

          if (infoItems.length) {
            gsap.fromTo(infoItems,
              { y: 25, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: conceptPanel,
                  start: 'top 45%',
                  end: 'top 15%',
                  scrub: 0.4,
                  ...scrollerConfig,
                },
              }
            );
          }
        }

        // =========================================
        // GALLERY SECTIONS - Slide up with content reveal
        // =========================================
        const gallerySections = contentRef.current.querySelectorAll(`.${styles.gallerySection}`);
        gallerySections.forEach((section, sectionIndex) => {
          // Section slides up
          gsap.fromTo(section,
            { y: 80, opacity: 0.3 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top 30%',
                scrub: 0.8,
                ...scrollerConfig,
              },
            }
          );

          // Header elements animate in
          const header = section.querySelector(`.${styles.gallerySectionHeader}`);
          if (header) {
            gsap.fromTo(header,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 70%',
                  end: 'top 40%',
                  scrub: 0.5,
                  ...scrollerConfig,
                },
              }
            );
          }

          // Gallery track slides in from right
          const track = section.querySelector(`.${styles.galleryTrack}`);
          if (track) {
            gsap.fromTo(track,
              { x: 60, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 60%',
                  end: 'top 30%',
                  scrub: 0.6,
                  ...scrollerConfig,
                },
              }
            );
          }
        });

        // =========================================
        // SPECS SECTION - Slide up with staggered items
        // =========================================
        const specsSection = contentRef.current.querySelector(`.${styles.specsSection}`);
        if (specsSection) {
          // Section slides up
          gsap.fromTo(specsSection,
            { y: 80, opacity: 0.3 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: specsSection,
                start: 'top bottom',
                end: 'top 30%',
                scrub: 0.8,
                ...scrollerConfig,
              },
            }
          );

          // Spec items slide in from right with stagger
          const specItems = specsSection.querySelectorAll(`.${styles.specItem}`);
          gsap.fromTo(specItems,
            { x: 60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              stagger: 0.03,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: specsSection,
                start: 'top 60%',
                end: 'top 20%',
                scrub: 0.5,
                ...scrollerConfig,
              },
            }
          );
        }

        // =========================================
        // PLANS SECTION - Cards scale and fade in
        // =========================================
        const plansSection = contentRef.current.querySelector(`.${styles.plansSection}`);
        if (plansSection) {
          gsap.fromTo(plansSection,
            { y: 60, opacity: 0.5 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: plansSection,
                start: 'top bottom',
                end: 'top 40%',
                scrub: 0.8,
                ...scrollerConfig,
              },
            }
          );

          const planItems = plansSection.querySelectorAll(`.${styles.planItem}`);
          gsap.fromTo(planItems,
            { scale: 0.85, opacity: 0, y: 40 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: plansSection,
                start: 'top 70%',
                end: 'top 30%',
                scrub: 0.5,
                ...scrollerConfig,
              },
            }
          );
        }

        // =========================================
        // DESCRIPTION SECTION - Text reveal
        // =========================================
        const descriptionSection = contentRef.current.querySelector(`.${styles.descriptionSection}`);
        if (descriptionSection) {
          gsap.fromTo(descriptionSection,
            { y: 50, opacity: 0.5 },
            {
              y: 0,
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: descriptionSection,
                start: 'top bottom',
                end: 'top 50%',
                scrub: 0.8,
                ...scrollerConfig,
              },
            }
          );

          const descriptionText = descriptionSection.querySelector(`.${styles.descriptionText}`);
          if (descriptionText) {
            const descSplit = new SplitText(descriptionText, {
              type: 'words',
              wordsClass: styles.splitWord,
            });
            splitTextInstancesRef.current.push(descSplit);

            gsap.fromTo(descSplit.words,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.01,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: descriptionText,
                  start: 'top 80%',
                  end: 'top 40%',
                  scrub: 0.4,
                  ...scrollerConfig,
                },
              }
            );
          }

          const endMark = descriptionSection.querySelector(`.${styles.projectEndMark}`);
          if (endMark) {
            gsap.fromTo(endMark,
              { opacity: 0, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                  trigger: endMark,
                  start: 'top 90%',
                  end: 'top 70%',
                  scrub: 0.5,
                  ...scrollerConfig,
                },
              }
            );
          }
        }

        // =========================================
        // SECTION TITLES - Character animation
        // =========================================
        const sectionTitles = contentRef.current.querySelectorAll(`.${styles.sectionTitle}`);
        sectionTitles.forEach((title) => {
          const titleSplit = new SplitText(title, {
            type: 'chars',
            charsClass: styles.splitChar,
          });
          splitTextInstancesRef.current.push(titleSplit);

          gsap.fromTo(titleSplit.chars,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.015,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 0.3,
                ...scrollerConfig,
              },
            }
          );
        });

    }, contentRef);

    return () => {
      ctx.revert();
      splitTextInstancesRef.current.forEach(instance => instance.revert());
      splitTextInstancesRef.current = [];
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isModal, prefersReducedMotion, displayProject]);

  // Refresh ScrollTrigger when content (like images) loads to correct layout calculations
  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(refreshTimer);
  }, [displayProject]);

  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const titleProgress = Math.min(Math.max(scrollY / windowHeight, 0), 1);

  const handleClose = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (propOnClose) {
      propOnClose(x, y);
    } else {
      setIsClosing({ x, y });
      setTimeout(() => {
        navigate('/');
      }, 800);
    }
  };

  if (!displayProject) {
    return <div>Proyecto no encontrado</div>;
  }

  return (
    <div className={`${styles.container} ${isModal ? styles.modalContainer : ''}`} ref={containerRef}>
      {isClosing && (
        <div className={styles.closingOverlay}>
          <div
            className={styles.closingCircle}
            style={{
              left: `${isClosing.x}px`,
              top: `${isClosing.y}px`,
            }}
          />
        </div>
      )}

      <button
        className={`${styles.closeButton} ${scrollY > windowHeight ? styles.closeButtonDark : ''}`}
        onClick={handleClose}
        aria-label="Cerrar proyecto"
      >
        <X size={20} />
      </button>

      {/* Hero section with sticky image */}
      <div className={styles.heroWrapper}>
        <div
          className={styles.stickyImageContainer}
          style={{
            position: isModal
              ? titleProgress < 1 ? 'sticky' : 'absolute'
              : titleProgress < 1 ? 'fixed' : 'absolute',
            top: titleProgress < 1 ? 0 : 'auto',
            bottom: titleProgress < 1 ? 'auto' : 0,
          }}
        >
          <img
            src={displayProject.mainImage}
            alt={displayProject.title}
            className={styles.heroImage}
            style={{
              transform: `scale(${1 + scrollY * 0.0001})`,
            }}
          />
          <div className={styles.imageOverlay} />

          <div
            className={styles.projectNumber}
            style={{
              opacity: 1 - titleProgress * 2,
              transform: `translateY(${titleProgress * -20}px)`,
            }}
          >
            {displayProject.number}
          </div>

          <div className={styles.titleContainer}>
            <h1
              className={styles.projectTitle}
              style={{
                transform: `translateY(${(1 - titleProgress) * 100}px)`,
                opacity: titleProgress,
              }}
            >
              {displayProject.title}
            </h1>
            <div
              className={styles.projectMeta}
              style={{
                transform: `translateY(${(1 - titleProgress) * 80}px)`,
                opacity: titleProgress > 0.3 ? (titleProgress - 0.3) / 0.7 : 0,
              }}
            >
              <span>{displayProject.location}</span>
              <span className={styles.metaSeparator}>·</span>
              <span>{displayProject.year}</span>
              <span className={styles.metaSeparator}>·</span>
              <span>{displayProject.category}</span>
            </div>
          </div>

          <div
            className={styles.scrollIndicator}
            style={{
              opacity: scrollY > 10 ? 0 : 1,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <span>Scroll</span>
            <div className={styles.scrollLine}></div>
          </div>
        </div>

        <div className={styles.scrollSpacer}></div>
      </div>

      {/* Main content section with scroll-snap */}
      <div className={styles.contentSection} ref={contentRef}>
        {/* Concept + Info - Full Page Panel */}
        <div className={styles.conceptPanel}>
          <div className={styles.conceptPanelInner}>
            <div className={styles.conceptContent}>
              <span className={styles.openingLabel}>Concepto</span>
              <p className={styles.conceptText} ref={conceptTextRef}>
                {displayProject.concept}
              </p>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Cliente</span>
                <span className={styles.infoValue}>{displayProject.client}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ubicación</span>
                <span className={styles.infoValue}>{displayProject.location}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Área</span>
                <span className={styles.infoValue}>{displayProject.area}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Año</span>
                <span className={styles.infoValue}>{displayProject.year}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Estado</span>
                <span className={styles.infoValue}>{displayProject.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Renders Section - Native CSS Horizontal Scroll Gallery */}
        {displayProject.renders.length > 0 && (
          <div className={`${styles.gallerySection} ${styles.rendersSection}`}>
            <div className={styles.gallerySectionHeader}>
              <span className={styles.sectionNumber}>01</span>
              <h2 className={styles.sectionTitle}>Visualización 3D</h2>
              <div className={styles.galleryControls}>
                <div className={styles.galleryProgress}>
                  <span className={styles.progressCurrent}>
                    {String(currentRenderIndex + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ transform: `scaleX(${rendersProgress})` }}
                    />
                  </div>
                  <span className={styles.progressTotal}>
                    {String(displayProject.renders.length).padStart(2, '0')}
                  </span>
                </div>
                <div className={styles.galleryNav}>
                  <button
                    className={styles.navButton}
                    onClick={() => scrollGallery(rendersTrackRef, -1, displayProject.renders.length)}
                    disabled={currentRenderIndex === 0}
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className={styles.navButton}
                    onClick={() => scrollGallery(rendersTrackRef, 1, displayProject.renders.length)}
                    disabled={currentRenderIndex >= displayProject.renders.length - 1}
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={styles.galleryTrack}
              ref={rendersTrackRef}
              onScroll={handleRendersScroll}
            >
              {displayProject.renders.map((render, index) => (
                <div key={index} className={styles.galleryItem}>
                  <div className={styles.galleryImageContainer}>
                    <img
                      src={render.url}
                      alt={render.caption}
                      className={styles.galleryImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.galleryCaption}>
                    <span className={styles.captionIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.captionText}>{render.caption}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.scrollHint}>
              <span>Desliza para ver más</span>
              <ChevronRight size={16} />
            </div>
          </div>
        )}

        {/* Photography Section - Native CSS Horizontal Scroll Gallery */}
        {displayProject.photos.length > 0 && (
          <div className={`${styles.gallerySection} ${styles.photosSection}`}>
            <div className={styles.gallerySectionHeader}>
              <span className={styles.sectionNumber}>02</span>
              <h2 className={styles.sectionTitle}>Fotografía</h2>
              <div className={styles.galleryControls}>
                <div className={styles.galleryProgress}>
                  <span className={styles.progressCurrent}>
                    {String(currentPhotoIndex + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ transform: `scaleX(${photosProgress})` }}
                    />
                  </div>
                  <span className={styles.progressTotal}>
                    {String(displayProject.photos.length).padStart(2, '0')}
                  </span>
                </div>
                <div className={styles.galleryNav}>
                  <button
                    className={styles.navButton}
                    onClick={() => scrollGallery(photosTrackRef, -1, displayProject.photos.length)}
                    disabled={currentPhotoIndex === 0}
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className={styles.navButton}
                    onClick={() => scrollGallery(photosTrackRef, 1, displayProject.photos.length)}
                    disabled={currentPhotoIndex >= displayProject.photos.length - 1}
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={styles.galleryTrack}
              ref={photosTrackRef}
              onScroll={handlePhotosScroll}
            >
              {displayProject.photos.map((photo, index) => (
                <div key={index} className={styles.galleryItem}>
                  <div className={styles.galleryImageContainer}>
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className={styles.galleryImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.galleryCaption}>
                    <span className={styles.captionIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.captionText}>{photo.caption}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.scrollHint}>
              <span>Desliza para ver más</span>
              <ChevronRight size={16} />
            </div>
          </div>
        )}

        {/* Specs & Details */}
        {displayProject.specs.length > 0 && (
          <div className={styles.specsSection}>
            <div className={styles.specsInner}>
              <div className={styles.specsHeader}>
                <span className={styles.sectionNumber}>03</span>
                <h2 className={styles.sectionTitle}>Especificaciones</h2>
              </div>
              <ul className={styles.specsList}>
                {displayProject.specs.map((spec, index) => (
                  <li key={index} className={styles.specItem}>
                    <span className={styles.specIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.specText}>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Floor Plans Section */}
        {displayProject.plans.length > 0 && (
          <div className={styles.plansSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>04</span>
              <h2 className={styles.sectionTitle}>Planos Arquitectónicos</h2>
            </div>
            <div className={styles.plansGrid}>
              {displayProject.plans.map((plan, index) => (
                <div key={index} className={styles.planItem}>
                  <div className={styles.planImageWrapper}>
                    <img
                      src={plan.url}
                      alt={plan.caption}
                      className={styles.planImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.planCaption}>
                    <span className={styles.planNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.planText}>{plan.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className={styles.descriptionSection}>
          <div className={styles.descriptionInner}>
            <p className={styles.descriptionText}>{displayProject.description}</p>
          </div>
          <div className={styles.projectEndMark}>
            <div className={styles.endMarkLine}></div>
            <span className={styles.endMarkText}>
              {displayProject.number} · {displayProject.year}
            </span>
            <div className={styles.endMarkLine}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
