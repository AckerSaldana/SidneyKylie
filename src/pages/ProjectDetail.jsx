import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/ProjectDetail.module.css';
import { useReducedMotion } from '../hooks';

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
  const prefersReducedMotion = useReducedMotion();

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

  // GSAP scroll-triggered animations
  useEffect(() => {
    if (prefersReducedMotion || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Animate section titles
      const sectionTitles = contentRef.current.querySelectorAll(`.${styles.sectionTitle}`);
      sectionTitles.forEach((title) => {
        gsap.fromTo(title,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              scroller: isModal ? containerRef.current : undefined,
            },
          }
        );
      });

      // Animate info grid
      const infoRows = contentRef.current.querySelectorAll(`.${styles.infoRow}`);
      gsap.fromTo(infoRows,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: infoRows[0],
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            scroller: isModal ? containerRef.current : undefined,
          },
        }
      );

      // Animate concept text
      const conceptText = contentRef.current.querySelector(`.${styles.conceptText}`);
      if (conceptText) {
        gsap.fromTo(conceptText,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: conceptText,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              scroller: isModal ? containerRef.current : undefined,
            },
          }
        );
      }

      // Animate render items
      const renderItems = contentRef.current.querySelectorAll(`.${styles.renderItem}`);
      renderItems.forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              scroller: isModal ? containerRef.current : undefined,
            },
          }
        );
      });

      // Animate photo items with stagger
      const photoItems = contentRef.current.querySelectorAll(`.${styles.photoItem}`);
      photoItems.forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
              scroller: isModal ? containerRef.current : undefined,
            },
          }
        );
      });

      // Animate plan items
      const planItems = contentRef.current.querySelectorAll(`.${styles.planItem}`);
      planItems.forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              scroller: isModal ? containerRef.current : undefined,
            },
          }
        );
      });

      // Animate description
      const descriptionText = contentRef.current.querySelector(`.${styles.descriptionText}`);
      if (descriptionText) {
        gsap.fromTo(descriptionText,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: descriptionText,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
              scroller: isModal ? containerRef.current : undefined,
            },
          }
        );
      }

      // Animate end mark
      const endMark = contentRef.current.querySelector(`.${styles.projectEndMark}`);
      if (endMark) {
        gsap.fromTo(endMark,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: endMark,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
              scroller: isModal ? containerRef.current : undefined,
            },
          }
        );
      }

    }, contentRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isModal, prefersReducedMotion, displayProject]);

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

      {/* Main content section */}
      <div className={styles.contentSection} ref={contentRef}>
        <div className={styles.contentInner}>
          {/* Project Info */}
          <div className={styles.infoGrid}>
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>FICHA TÉCNICA</h2>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Proyecto</span>
                  <span className={styles.infoValue}>{displayProject.title}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Cliente</span>
                  <span className={styles.infoValue}>{displayProject.client}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ubicación</span>
                  <span className={styles.infoValue}>{displayProject.location}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Área Total</span>
                  <span className={styles.infoValue}>{displayProject.area}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Año</span>
                  <span className={styles.infoValue}>{displayProject.year}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Estado</span>
                  <span className={styles.infoValue}>{displayProject.status}</span>
                </div>
              </div>
            </div>

            <div className={styles.conceptSection}>
              <h2 className={styles.sectionTitle}>CONCEPTO</h2>
              <p className={styles.conceptText}>{displayProject.concept}</p>

              {displayProject.specs.length > 0 && (
                <div className={styles.specsSection}>
                  <h3 className={styles.subsectionTitle}>ESPECIFICACIONES</h3>
                  <ul className={styles.specsList}>
                    {displayProject.specs.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 3D Renders Section */}
          {displayProject.renders.length > 0 && (
            <div className={styles.rendersSection}>
              <h2 className={styles.sectionTitle}>RENDERS 3D</h2>
              <div className={styles.rendersGrid}>
                {displayProject.renders.map((render, index) => (
                  <div key={index} className={styles.renderItem}>
                    <div className={styles.renderImageContainer}>
                      <img
                        src={render.url}
                        alt={render.caption}
                        className={styles.renderImage}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.imageCaption}>
                      <span className={styles.captionText}>{render.caption}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photography Section */}
          {displayProject.photos.length > 0 && (
            <div className={styles.photosSection}>
              <h2 className={styles.sectionTitle}>FOTOGRAFÍAS</h2>
              <div className={styles.photosGrid}>
                {displayProject.photos.map((photo, index) => (
                  <div key={index} className={`${styles.photoItem} ${styles[`photo${index + 1}`] || ''}`}>
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className={styles.photoImage}
                      loading="lazy"
                    />
                    <div className={styles.photoOverlay}>
                      <span className={styles.photoCaption}>{photo.caption}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Floor Plans Section */}
          {displayProject.plans.length > 0 && (
            <div className={styles.plansSection}>
              <h2 className={styles.sectionTitle}>PLANOS ARQUITECTÓNICOS</h2>
              <div className={styles.plansGrid}>
                {displayProject.plans.map((plan, index) => (
                  <div key={index} className={styles.planItem}>
                    <img
                      src={plan.url}
                      alt={plan.caption}
                      className={styles.planImage}
                      loading="lazy"
                    />
                    <div className={styles.imageCaption}>
                      <span className={styles.captionNumber}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.captionText}>{plan.caption}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>DESCRIPCIÓN</h2>
            <p className={styles.descriptionText}>{displayProject.description}</p>
            <div className={styles.projectEndMark}>
              <span>{displayProject.number}</span>
              <span className={styles.endMarkSeparator}>·</span>
              <span>{displayProject.year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
