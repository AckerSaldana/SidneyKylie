import { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { getProjectById, getNextProject } from '../data/projects';
import { useTransition } from '../contexts';
import { useInView } from '../hooks';
import styles from '../styles/ProjectDetail.module.css';

/**
 * ProjectDetail - Full-page project showcase
 * Uses IntersectionObserver for reliable scroll animations
 * No GSAP ScrollTrigger, no horizontal scrolling
 */
const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startExitTransition, startTransition } = useTransition();

  // Refs for next project transition
  const nextProjectImageRef = useRef(null);

  // Get project data
  const project = getProjectById(id);
  const nextProject = getNextProject(id);

  // IntersectionObserver hooks for each section
  const [infoRef, infoInView] = useInView({ threshold: 0.15 });
  const [galleryRef, galleryInView] = useInView({ threshold: 0.05 });
  const [specsRef, specsInView] = useInView({ threshold: 0.15 });
  const [plansRef, plansInView] = useInView({ threshold: 0.1 });
  const [nextRef, nextInView] = useInView({ threshold: 0.2 });

  // Combine renders and photos for gallery
  const galleryItems = project ? [
    ...project.renders.map((r, i) => ({ ...r, type: 'render', id: `render-${i}` })),
    ...project.photos.map((p, i) => ({ ...p, type: 'photo', id: `photo-${i}` })),
  ] : [];

  // Handle close button
  const handleClose = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    startExitTransition(x, y, '/');
    setTimeout(() => navigate('/'), 400);
  };

  // Handle next project click
  const handleNextProject = () => {
    if (nextProjectImageRef.current && nextProject) {
      startTransition(nextProjectImageRef.current, `/project/${nextProject.id}`);
      setTimeout(() => navigate(`/project/${nextProject.id}`), 400);
    }
  };

  // Project not found
  if (!project) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>Proyecto no encontrado</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Close Button */}
      <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar">
        <X size={24} />
      </button>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <img
            src={project.mainImage}
            alt={project.title}
            className={styles.heroImage}
            fetchpriority="high"
          />
        </div>
        <div className={styles.heroOverlay} />

        {/* Oversized project number watermark */}
        <span className={styles.heroNumber}>{project.number}</span>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {project.title.split(' ').map((word, i) => (
              <span key={i} className={styles.heroTitleWord} style={{ '--word-index': i }}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <div className={styles.heroMeta}>
            <span>{project.location}</span>
            <span className={styles.dot}>·</span>
            <span>{project.year}</span>
          </div>
        </div>

        <div className={styles.scrollHint}>
          <span>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>

      {/* ============================================
          INFO SECTION
          ============================================ */}
      <section
        ref={infoRef}
        className={`${styles.infoSection} ${infoInView ? styles.visible : ''}`}
      >
        <div className={styles.infoGrid}>
          {/* Sidebar with metadata */}
          <div className={styles.infoSidebar}>
            <div className={styles.infoItem} style={{ '--index': 0 }}>
              <span className={styles.infoLabel}>Cliente</span>
              <span className={styles.infoValue}>{project.client}</span>
            </div>
            <div className={styles.infoItem} style={{ '--index': 1 }}>
              <span className={styles.infoLabel}>Ubicación</span>
              <span className={styles.infoValue}>{project.location}</span>
            </div>
            <div className={styles.infoItem} style={{ '--index': 2 }}>
              <span className={styles.infoLabel}>Área</span>
              <span className={styles.infoValue}>{project.area}</span>
            </div>
            <div className={styles.infoItem} style={{ '--index': 3 }}>
              <span className={styles.infoLabel}>Año</span>
              <span className={styles.infoValue}>{project.year}</span>
            </div>
            <div className={styles.infoItem} style={{ '--index': 4 }}>
              <span className={styles.infoLabel}>Estado</span>
              <span className={styles.infoValue}>{project.status}</span>
            </div>
            <div className={styles.infoItem} style={{ '--index': 5 }}>
              <span className={styles.infoLabel}>Categoría</span>
              <span className={styles.infoValue}>{project.category}</span>
            </div>
          </div>

          {/* Main content */}
          <div className={styles.infoContent}>
            <span className={styles.sectionLabel}>Concepto</span>
            <p className={styles.conceptText}>"{project.concept}"</p>
            <p className={styles.descriptionText}>{project.fullDescription}</p>
          </div>
        </div>
      </section>

      {/* ============================================
          GALLERY SECTION (Vertical Masonry)
          ============================================ */}
      <section
        ref={galleryRef}
        className={`${styles.gallery} ${galleryInView ? styles.visible : ''}`}
      >
        <div className={styles.galleryHeader}>
          <span className={styles.sectionNum}>02</span>
          <h2 className={styles.sectionHeading}>Galería</h2>
          <span className={styles.galleryCount}>{galleryItems.length} imágenes</span>
        </div>

        <div className={styles.galleryGrid}>
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={styles.galleryItem}
              style={{ '--index': index }}
            >
              <div className={styles.galleryImageWrapper}>
                <img
                  src={item.url}
                  alt={item.caption}
                  className={styles.galleryImage}
                  loading="lazy"
                />
              </div>
              <div className={styles.galleryCaption}>
                <span className={styles.captionNum}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.captionText}>{item.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================
          SPECS SECTION
          ============================================ */}
      {project.specs && project.specs.length > 0 && (
        <section
          ref={specsRef}
          className={`${styles.specs} ${specsInView ? styles.visible : ''}`}
        >
          <div className={styles.specsInner}>
            <div className={styles.specsHeader}>
              <span className={styles.sectionNum}>03</span>
              <h2 className={styles.sectionHeading}>Especificaciones</h2>
            </div>

            <ul className={styles.specsList}>
              {project.specs.map((spec, index) => (
                <li
                  key={index}
                  className={styles.specItem}
                  style={{ '--index': index }}
                >
                  <span className={styles.specNum}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.specText}>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ============================================
          PLANS SECTION
          ============================================ */}
      {project.plans && project.plans.length > 0 && (
        <section
          ref={plansRef}
          className={`${styles.plans} ${plansInView ? styles.visible : ''}`}
        >
          <div className={styles.plansHeader}>
            <span className={styles.sectionNum}>04</span>
            <h2 className={styles.sectionHeading}>Planos</h2>
          </div>

          <div className={styles.plansGrid}>
            {project.plans.map((plan, index) => (
              <div
                key={index}
                className={styles.planItem}
                style={{ '--index': index }}
              >
                <div className={styles.planImageWrapper}>
                  <img
                    src={plan.url}
                    alt={plan.caption}
                    className={styles.planImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.planCaption}>
                  <span className={styles.planNum}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.planText}>{plan.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          NEXT PROJECT SECTION
          ============================================ */}
      {nextProject && (
        <section
          ref={nextRef}
          className={`${styles.nextProject} ${nextInView ? styles.visible : ''}`}
          onClick={handleNextProject}
        >
          <div className={styles.nextContent}>
            <span className={styles.nextLabel}>Siguiente proyecto</span>
            <h2 className={styles.nextTitle}>{nextProject.title}</h2>
            <div className={styles.nextCta}>
              <span>Ver proyecto</span>
              <ArrowRight size={20} />
            </div>
          </div>

          <div className={styles.nextImageWrapper} ref={nextProjectImageRef}>
            <img
              src={nextProject.mainImage || nextProject.image}
              alt={nextProject.title}
              className={styles.nextImage}
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* ============================================
          FOOTER MARK
          ============================================ */}
      <footer className={styles.footerMark}>
        <div className={styles.markLine} />
        <span className={styles.markText}>Sidney Kylie · {project.number} · {project.year}</span>
        <div className={styles.markLine} />
      </footer>
    </div>
  );
};

export default ProjectDetail;
