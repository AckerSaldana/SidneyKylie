import React, { useEffect, useRef } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import styles from '../../styles/LandingPage.module.css';
import { useReducedMotion } from '../../hooks';

/**
 * Projects carousel section with GSAP animations
 */
const ProjectsSection = ({
  projects,
  projectRefs,
  containerRef,
  showScrollIndicator,
  onProjectClick,
}) => {
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const indicatorRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const hasAnimated = useRef(false);

  // Animate header elements when section becomes visible
  useEffect(() => {
    if (prefersReducedMotion || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateIn();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const animateIn = () => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Animate title with character split effect
      if (titleRef.current) {
        const chars = titleRef.current.textContent.split('');
        titleRef.current.innerHTML = chars
          .map((char) => `<span class="${styles.animChar}">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('');

        const charElements = titleRef.current.querySelectorAll(`.${styles.animChar}`);
        gsap.set(charElements, { opacity: 0, y: 40 });

        tl.to(charElements, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.02,
        }, 0);
      }

      // Animate subtitle
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, 0.3);
      }

      // Animate scroll indicator
      if (indicatorRef.current) {
        gsap.set(indicatorRef.current, { opacity: 0, y: 10 });
        tl.to(indicatorRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
        }, 0.5);
      }
    }, headerRef);

    return () => ctx.revert();
  };

  // Project card hover animation - enhanced for 3D carousel
  const handleProjectHover = (element, isHovering) => {
    if (prefersReducedMotion || !element) return;

    // Reset CSS custom properties on hover for full visibility
    if (isHovering) {
      element.style.setProperty('--distance', '0');
      element.style.setProperty('--abs-distance', '0');
    }

    // Image zoom effect on hover
    const image = element.querySelector(`.${styles.projectThumbnail}`);
    if (image) {
      gsap.to(image, {
        scale: isHovering ? 1.1 : 1,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.projectsContainer} ref={containerRef}>
        <div className={styles.projectsHeader} ref={headerRef}>
          <h2 className={styles.sectionTitle} ref={titleRef}>
            PROYECTOS DESTACADOS
          </h2>
          <p className={styles.projectsSubtitle} ref={subtitleRef}>
            Explora mi colección de diseños arquitectónicos
          </p>

          {/* Indicador de scroll */}
          {showScrollIndicator && (
            <div className={styles.scrollIndicator} ref={indicatorRef}>
              <span>Desliza hacia abajo</span>
              <div className={styles.scrollArrow}>
                <ChevronRight size={24} style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
          )}
        </div>

        <div className={styles.projectsContent}>
          <div className={styles.projectsList}>
            {projects.map((project, index) => (
              <article
                key={project.id}
                ref={(el) => {
                  if (projectRefs) {
                    projectRefs.current[project.id] = el;
                  }
                }}
                className={styles.projectItem}
                data-project-item="true"
                data-index={index}
                onMouseEnter={(e) => handleProjectHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleProjectHover(e.currentTarget, false)}
              >
                <div className={styles.projectNumber}>{project.number}</div>

                <div className={styles.projectImageContainer}>
                  <div className={styles.projectImageCircle}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles.projectThumbnail}
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className={styles.projectDetails}>
                  <span className={styles.projectCategory}>{project.category}</span>
                  <h3 className={styles.projectName}>{project.title}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>

                  <div className={styles.projectMeta}>
                    <span>{project.location}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                    <span>•</span>
                    <span>{project.size}</span>
                  </div>

                  <button
                    className={styles.projectLink}
                    onClick={() => onProjectClick(project.id)}
                  >
                    <span>Ver proyecto</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
