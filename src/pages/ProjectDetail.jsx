import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import styles from '../styles/ProjectDetail.module.css';

const ProjectDetail = ({ projectId: propProjectId, onClose: propOnClose, isModal = false }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = propProjectId || paramId; // Use prop if modal, param if route
  const [scrollY, setScrollY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef(null);

  // Project data - Real project
  const projectsData = {
    '1': {
      id: '1',
      number: '01',
      title: "CASA TERRA 027",
      category: "Residencial",
      year: "2024",
      location: "Corregidora, Querétaro",
      area: "560 m²",
      client: "Privado",
      status: "Construido",
      description: "Residencia unifamiliar diseñada para una familia multigeneracional, ubicada en Corregidora, Querétaro. El diseño responde a un terreno de forma irregular y a las condiciones normativas locales, integrando estrategias sustentables que consideran el clima cambiante de la región. La vivienda favorece la ventilación natural cruzada, el confort térmico y la iluminación pasiva a través de patios interiores, celosías y volúmenes abiertos que permiten una conexión fluida entre espacios.",
      concept: "El proyecto se concibe como una secuencia de espacios interconectados que integran elementos de la arquitectura vernácula y estrategias contemporáneas. Mediante el uso de tierra apisonada, concreto aparente y madera local, se crea una atmósfera cálida, flexible y funcional. Los volúmenes se disponen en torno a patios que ofrecen privacidad, regulación climática y conexión visual con el entorno natural, generando una experiencia doméstica sensible y adaptada a las necesidades de cada miembro de la familia.",
      // Main hero image - use one of your best renders
      mainImage: "/projects/casa-1/photos/photo-6.png",
      // 3D Renders without background
      renders: [
        { url: "/projects/casa-1/renders/render-4.png", caption: "Fachada noreste" },
        { url: "/projects/casa-1/renders/render-1.png", caption: "Fachada suroeste" },
        { url: "/projects/casa-1/renders/render-3.png", caption: "Corte longitudinal B-B' 3D" },
        { url: "/projects/casa-1/renders/render-2.png", caption: "Corte longitudinal A-A' 3D" }
      ],
      // Real photos of the house
      photos: [
        { url: "/projects/casa-1/photos/photo-1.png", caption: "Cocina - Barra" },
        { url: "/projects/casa-1/photos/photo-2.png", caption: "Sala de estar" },
        { url: "/projects/casa-1/photos/photo-3.png", caption: "Recamara principal" },
        { url: "/projects/casa-1/photos/photo-4.png", caption: "Asador con barra exterior" },
        { url: "/projects/casa-1/photos/photo-5.png", caption: "Comedor" },
        { url: "/projects/casa-1/photos/photo-6.png", caption: "Area social" },
        { url: "/projects/casa-1/photos/photo-7.png", caption: "Fachada principal" },
        { url: "/projects/casa-1/photos/photo-8.png", caption: "Jardin interior" },
        { url: "/projects/casa-1/photos/photo-9.png", caption: "Vista a jardin interior" }
      ],
      // Floor plans
      plans: [
        { url: "/projects/casa-1/plans/plan-1.png", caption: "Planta de conjunto" },
        { url: "/projects/casa-1/plans/plan-2.png", caption: "Planta baja" },
        { url: "/projects/casa-1/plans/plan-3.png", caption: "Planta alta" }
      ],
      specs: [
        "Estructura de concreto armado y acero",
        "Muros de block con aplanado de mortero",
        "Cancelería de aluminio con doble acristalamiento",
        "Pisos de mármol y madera de ingeniería",
        "Sistema de climatización VRF",
        "Iluminación LED automatizada",
        "Paneles solares 10kW"
      ]
    }
  };

  const project = projectsData[id] || projectsData['1']; // Default to project 1

  useEffect(() => {
    let scrollElement = window;
    
    if (isModal && containerRef.current) {
      // For modal, listen to the container's scroll
      scrollElement = containerRef.current;
    } else {
      // For regular page, enable scrolling
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
        // Cleanup only for non-modal
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.overflow = '';
        document.body.style.height = '';
      }
    };
  }, [isModal]);

  // Calculate progress values
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const titleProgress = Math.min(Math.max(scrollY / windowHeight, 0), 1);

  // Handle close with animation
  const handleClose = (e) => {
    // Get button position for animation origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    if (propOnClose) {
      // For modal, pass coordinates to parent
      propOnClose(x, y);
    } else {
      // For standalone page, use internal closing animation
      setIsClosing({ x, y });
      
      // Wait for animation then navigate
      setTimeout(() => {
        navigate('/');
      }, 800);
    }
  };

  return (
    <div className={`${styles.container} ${isModal ? styles.modalContainer : ''}`} ref={containerRef}>
      {/* Closing animation overlay */}
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
      
      {/* Close button */}
      <button 
        className={`${styles.closeButton} ${scrollY > windowHeight ? styles.closeButtonDark : ''}`}
        onClick={handleClose}
        aria-label="Close project"
      >
        <X size={20} />
      </button>

      {/* Hero section with sticky image */}
      <div className={styles.heroWrapper}>
        <div 
          className={styles.stickyImageContainer}
          style={{
            position: isModal 
              ? (titleProgress < 1 ? 'sticky' : 'absolute')
              : (titleProgress < 1 ? 'fixed' : 'absolute'),
            top: titleProgress < 1 ? 0 : 'auto',
            bottom: titleProgress < 1 ? 'auto' : 0,
          }}
        >
          <img 
            src={project.mainImage} 
            alt={project.title}
            className={styles.heroImage}
            style={{
              transform: `scale(${1 + scrollY * 0.0001})`,
            }}
          />
          <div className={styles.imageOverlay} />
          
          {/* Project number - top left */}
          <div 
            className={styles.projectNumber}
            style={{
              opacity: 1 - titleProgress * 2,
              transform: `translateY(${titleProgress * -20}px)`,
            }}
          >
            {project.number}
          </div>

          {/* Title content - bottom center */}
          <div className={styles.titleContainer}>
            <h1 
              className={styles.projectTitle}
              style={{
                transform: `translateY(${(1 - titleProgress) * 100}px)`,
                opacity: titleProgress,
              }}
            >
              {project.title}
            </h1>
            <div 
              className={styles.projectMeta}
              style={{
                transform: `translateY(${(1 - titleProgress) * 80}px)`,
                opacity: titleProgress > 0.3 ? (titleProgress - 0.3) / 0.7 : 0,
              }}
            >
              <span>{project.location}</span>
              <span className={styles.metaSeparator}>·</span>
              <span>{project.year}</span>
              <span className={styles.metaSeparator}>·</span>
              <span>{project.category}</span>
            </div>
          </div>

          {/* Scroll indicator */}
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

        {/* Spacer for scroll */}
        <div className={styles.scrollSpacer}></div>
      </div>

      {/* Main content section */}
      <div className={styles.contentSection}>
        <div className={styles.contentInner}>
          {/* Project Info */}
          <div className={styles.infoGrid}>
            <div className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>FICHA TÉCNICA</h2>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Proyecto</span>
                  <span className={styles.infoValue}>{project.title}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Cliente</span>
                  <span className={styles.infoValue}>{project.client}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ubicación</span>
                  <span className={styles.infoValue}>{project.location}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Área Total</span>
                  <span className={styles.infoValue}>{project.area}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Año</span>
                  <span className={styles.infoValue}>{project.year}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Estado</span>
                  <span className={styles.infoValue}>{project.status}</span>
                </div>
              </div>
            </div>

            <div className={styles.conceptSection}>
              <h2 className={styles.sectionTitle}>CONCEPTO</h2>
              <p className={styles.conceptText}>{project.concept}</p>
              
              <div className={styles.specsSection}>
                <h3 className={styles.subsectionTitle}>ESPECIFICACIONES</h3>
                <ul className={styles.specsList}>
                  {project.specs.map((spec, index) => (
                    <li key={index}>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3D Renders Section */}
          <div className={styles.rendersSection}>
            <h2 className={styles.sectionTitle}>RENDERS 3D</h2>
            <div className={styles.rendersGrid}>
              {project.renders.map((render, index) => (
                <div key={index} className={styles.renderItem}>
                  <div className={styles.renderImageContainer}>
                    <img 
                      src={render.url} 
                      alt={render.caption}
                      className={styles.renderImage}
                    />
                  </div>
                  <div className={styles.imageCaption}>
                    <span className={styles.captionText}>{render.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photography Section */}
          <div className={styles.photosSection}>
            <h2 className={styles.sectionTitle}>FOTOGRAFÍAS</h2>
            <div className={styles.photosGrid}>
              {project.photos.map((photo, index) => (
                <div key={index} className={`${styles.photoItem} ${styles[`photo${index + 1}`]}`}>
                  <img 
                    src={photo.url} 
                    alt={photo.caption}
                    className={styles.photoImage}
                  />
                  <div className={styles.photoOverlay}>
                    <span className={styles.photoCaption}>{photo.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floor Plans Section */}
          <div className={styles.plansSection}>
            <h2 className={styles.sectionTitle}>PLANOS ARQUITECTÓNICOS</h2>
            <div className={styles.plansGrid}>
              {project.plans.map((plan, index) => (
                <div key={index} className={styles.planItem}>
                  <img 
                    src={plan.url} 
                    alt={plan.caption}
                    className={styles.planImage}
                  />
                  <div className={styles.imageCaption}>
                    <span className={styles.captionNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.captionText}>{plan.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>DESCRIPCIÓN</h2>
            <p className={styles.descriptionText}>{project.description}</p>
            <div className={styles.projectEndMark}>
              <span>{project.number}</span>
              <span className={styles.endMarkSeparator}>·</span>
              <span>{project.year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;