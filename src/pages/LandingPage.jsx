import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Menu, X, ArrowRight } from 'lucide-react';
import styles from '../styles/LandingPage.module.css';
import ClickSpark from '../components/ClickSpark';
import ProjectDetail from './ProjectDetail';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [aboutScrollProgress, setAboutScrollProgress] = useState(0);
  const [expandingProject, setExpandingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const projectsContainerRef = useRef(null);
  const aboutContainerRef = useRef(null);
  const projectRefs = useRef({});

  // Proyectos de ejemplo
  const projects = [
    {
      id: 1,
      number: "01",
      title: "Casa Terra 027",
      category: "Residencial",
      location: "Corregidora, Querétaro",
      year: "2024",
      size: "560 m²",
      image: "/projects/casa-1/photos/photo-6.png",
      description: "Residencia sustentable con diseño flexible y enfoque climático."
    },
    {
      id: 2,
      number: "02",
      title: "Torre Corporativa Sky",
      category: "Comercial",
      location: "Monterrey",
      year: "2023",
      size: "2,400 m²",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      description: "Espacio corporativo con diseño biofílico"
    },
    {
      id: 3,
      number: "03",
      title: "Loft Industrial",
      category: "Residencial",
      location: "Guadalajara",
      year: "2023",
      size: "180 m²",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      description: "Conversión de espacio industrial a vivienda"
    },
    {
      id: 4,
      number: "04",
      title: "Boutique Hotel Nómada",
      category: "Hospitalidad",
      location: "Playa del Carmen",
      year: "2023",
      size: "1,200 m²",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      description: "Hotel boutique con diseño sustentable"
    },
    {
      id: 5,
      number: "05",
      title: "Estudio de Arte",
      category: "Cultural",
      location: "San Miguel de Allende",
      year: "2022",
      size: "450 m²",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      description: "Espacio multifuncional para artistas"
    },
    {
      id: 6,
      number: "06",
      title: "Café Origen",
      category: "Comercial",
      location: "Puebla",
      year: "2022",
      size: "120 m²",
      image: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&q=80",
      description: "Cafetería con diseño vernáculo contemporáneo"
    }
  ];

  // Navegación con teclas de flecha
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentSection < 3) {
        scrollToSection(currentSection + 1);
      } else if (e.key === 'ArrowLeft' && currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection]);


  // Detectar scroll en la sección de proyectos
  useEffect(() => {
    const projectsContainer = projectsContainerRef.current;
    if (!projectsContainer || currentSection !== 1) return;

    const handleProjectsScroll = () => {
      const scrollTop = projectsContainer.scrollTop;
      
      if (scrollTop > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
      
      // Efecto carrusel vertical mejorado
      const projectItems = projectsContainer.querySelectorAll('[data-project-item]');
      const containerRect = projectsContainer.getBoundingClientRect();
      const containerCenter = containerRect.height / 2;
      
      projectItems.forEach((item) => {
        // Si el item tiene hover, no aplicar efectos
        if (item.matches(':hover')) {
          return;
        }
        
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2 - containerRect.top;
        const distance = itemCenter - containerCenter;
        const maxDistance = containerRect.height / 2;
        
        // Normalizar distancia (-1 a 1)
        const normalizedDistance = Math.max(-1, Math.min(1, distance / maxDistance));
        const absDistance = Math.abs(normalizedDistance);
        
        // Aplicar efectos solo a elementos visibles
        if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
          // Escala suave
          const scale = 1 - (absDistance * 0.05);
          // Opacidad suave
          const opacity = 1 - (absDistance * 0.2);
          
          item.style.transform = `scale(${scale})`;
          item.style.opacity = opacity;
        }
      });
    };

    projectsContainer.addEventListener('scroll', handleProjectsScroll, { passive: true });
    handleProjectsScroll(); // Ejecutar una vez al inicio
    
    return () => {
      projectsContainer.removeEventListener('scroll', handleProjectsScroll);
    };
  }, [currentSection]);
  
  // Detectar scroll en la sección About con animaciones estilo Apple
  useEffect(() => {
    const aboutContainer = aboutContainerRef.current;
    if (!aboutContainer || currentSection !== 2) return;

    const handleAboutScroll = () => {
      const scrollTop = aboutContainer.scrollTop;
      const scrollHeight = aboutContainer.scrollHeight - aboutContainer.clientHeight;
      const progress = scrollTop / scrollHeight;
      
      // Ocultar indicador de scroll al iniciar el scroll
      if (scrollTop > 10) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
      
      setAboutScrollProgress(progress);
      
      // Obtener todas las secciones y elementos animados
      const sections = aboutContainer.querySelectorAll('[data-animate]');
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        
        // Calcular el progreso de la sección en el viewport
        const start = windowHeight * 0.9; // Comienza cuando el elemento está al 90% del viewport
        const end = windowHeight * 0.1; // Termina cuando está al 10%
        
        if (elementTop < start && elementBottom > end) {
          const sectionProgress = 1 - ((elementTop - end) / (start - end));
          const clampedProgress = Math.max(0, Math.min(1, sectionProgress));
          
          // Aplicar transformaciones basadas en el progreso
          section.style.setProperty('--progress', clampedProgress);
          
          // Animar elementos hijos con retraso
          const animatedChildren = section.querySelectorAll('[data-animate-delay]');
          animatedChildren.forEach((child, index) => {
            const delay = parseFloat(child.dataset.animateDelay) || index * 0.1;
            const childProgress = Math.max(0, Math.min(1, (clampedProgress - delay) / (1 - delay)));
            child.style.setProperty('--child-progress', childProgress);
          });
        }
      });
    };

    aboutContainer.addEventListener('scroll', handleAboutScroll, { passive: true });
    handleAboutScroll(); // Ejecutar una vez al inicio
    
    return () => {
      aboutContainer.removeEventListener('scroll', handleAboutScroll);
    };
  }, [currentSection]);

  // Navegación a sección específica
  const scrollToSection = (index) => {
    setCurrentSection(index);
    setIsMenuOpen(false);
    
    // Reset scroll al cambiar de sección
    if (index !== 1 && projectsContainerRef.current) {
      projectsContainerRef.current.scrollTop = 0;
    }
    if (index !== 2 && aboutContainerRef.current) {
      aboutContainerRef.current.scrollTop = 0;
    }
    // Siempre mostrar indicador al entrar a una nueva sección
    setShowScrollIndicator(true);
  };

  const handleProjectClick = (projectId) => {
    const projectElement = projectRefs.current[projectId];
    if (!projectElement) return;

    const imageCircle = projectElement.querySelector(`.${styles.projectImageCircle}`);
    const rect = imageCircle.getBoundingClientRect();
    
    // Calculate initial position
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Determine which corner is opposite (farthest from the click point)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate distances to each corner
    const corners = [
      { x: 0, y: 0 }, // top-left
      { x: viewportWidth, y: 0 }, // top-right
      { x: 0, y: viewportHeight }, // bottom-left
      { x: viewportWidth, y: viewportHeight } // bottom-right
    ];
    
    // Find the farthest corner
    let maxDistance = 0;
    let targetCorner = corners[0];
    
    corners.forEach(corner => {
      const distance = Math.sqrt(
        Math.pow(corner.x - centerX, 2) + 
        Math.pow(corner.y - centerY, 2)
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        targetCorner = corner;
      }
    });
    
    // First set expanding state
    setExpandingProject({
      id: projectId,
      x: centerX,
      y: centerY,
      width: rect.width,
      height: rect.height,
      phase: 'expanding',
      targetX: targetCorner.x,
      targetY: targetCorner.y
    });

    // After expansion completes, load the project and hold the expanded state
    setTimeout(() => {
      setSelectedProject(projectId);
      // Give time for the page to load while circle covers the screen
      setTimeout(() => {
        setExpandingProject(prev => ({ ...prev, phase: 'contracting' }));
      }, 200); // Wait 200ms for page to fully load
    }, 400);

    // Remove animation overlay after full animation
    setTimeout(() => {
      setExpandingProject(null);
    }, 1000);
  };

  const handleCloseProject = (closeX, closeY) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Default to center if no coordinates provided
    const x = closeX || viewportWidth / 2;
    const y = closeY || viewportHeight / 2;
    
    // First expand from close button
    setExpandingProject({
      id: 'exit',
      x: x,
      y: y,
      width: 40, // Close button size
      height: 40,
      phase: 'exitExpanding',
      // For exit, always contract from top-right to bottom-left
      originX: viewportWidth, // top-right corner
      originY: 0,
      targetX: 0, // bottom-left corner
      targetY: viewportHeight
    });
    
    // After expansion, contract to corner
    setTimeout(() => {
      setExpandingProject(prev => ({ ...prev, phase: 'exitContracting' }));
      // Hide the project modal only after circle is fully expanded
      setTimeout(() => {
        setSelectedProject(null);
      }, 50); // Small delay to ensure smooth transition
    }, 400);
    
    // Remove animation overlay after full animation
    setTimeout(() => {
      setExpandingProject(null);
    }, 800);
  };

  return (
    <ClickSpark>
      <div className={`${styles.container} ${styles.landingContainer}`}>
      {/* Menú de navegación - Solo visible después de la landing */}
      <nav className={`${styles.nav} ${currentSection > 0 ? styles.visible : ''}`}>
        <div className={styles.navContent}>
          <div 
            className={styles.logoContainer}
            onClick={() => scrollToSection(0)}
          >
            <img 
              src="/images/logo.png" 
              alt="SK Logo" 
              className={styles.logoImage}
            />
            <h1 className={styles.logo}>SK</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className={styles.navLinks}>
            <button onClick={() => scrollToSection(0)}>INICIO</button>
            <button onClick={() => scrollToSection(1)}>PROYECTOS</button>
            <button onClick={() => scrollToSection(2)}>SOBRE MÍ</button>
            <button onClick={() => scrollToSection(3)}>CONTACTO</button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={styles.menuButton}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <button onClick={() => scrollToSection(0)}>INICIO</button>
            <button onClick={() => scrollToSection(1)}>PROYECTOS</button>
            <button onClick={() => scrollToSection(2)}>SOBRE MÍ</button>
            <button onClick={() => scrollToSection(3)}>CONTACTO</button>
          </div>
        )}
      </nav>

      {/* Indicadores de navegación */}
      <div className={styles.indicators}>
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`${styles.indicator} ${currentSection === index ? styles.active : ''}`}
          />
        ))}
      </div>

      {/* Wrapper para overflow */}
      <div className={styles.sectionsWrapper}>
        {/* Contenedor principal */}
        <div 
          className={styles.sectionsContainer}
          style={{ transform: `translateX(-${currentSection * 100}vw)` }}
        >
        {/* Sección 1: Hero/Landing */}
        <section className={`${styles.section} ${styles.heroSection}`}>
          {/* Video de fondo */}
          <video 
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/video/background-video.mp4" type="video/mp4" />
            {/* Puedes agregar más formatos para mejor compatibilidad */}
            {/* <source src="/video/background-video.webm" type="video/webm" /> */}
          </video>
          
          {/* Overlay opcional para mejorar legibilidad del texto */}
          <div className={styles.videoOverlay} />
          
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>
              {'Sidney'.split('').map((letter, index) => (
                <span key={index} className={styles.floatingLetter} style={{ animationDelay: `${index * 0.1}s` }}>
                  {letter}
                </span>
              ))}
              <span className={styles.heroSubtitle}>
                {'Kylie'.split('').map((letter, index) => (
                  <span key={index} className={styles.floatingLetter} style={{ animationDelay: `${(index + 6) * 0.1}s` }}>
                    {letter}
                  </span>
                ))}
              </span>
            </h2>
            <p className={styles.heroDescription}>
            Diseñando espacios con propósito. Arquitectura interior que une sensibilidad, sustentabilidad y experiencia vivida.
            </p>
            <button 
              onClick={() => scrollToSection(1)}
              className={styles.ctaButton}
            >
              VER PROYECTOS
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Decoración geométrica */}
          <div className={styles.decoration1} />
          <div className={styles.decoration2} />
        </section>

        {/* Sección 2: Proyectos Preview */}
        <section className={styles.section}>
          <div className={styles.projectsContainer} ref={projectsContainerRef}>
            <div className={styles.projectsHeader}>
              <h2 className={styles.sectionTitle}>PROYECTOS DESTACADOS</h2>
              <p className={styles.projectsSubtitle}>
                Explora mi colección de diseños arquitectónicos
              </p>
              
              {/* Indicador de scroll */}
              {showScrollIndicator && (
                <div className={styles.scrollIndicator}>
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
                    ref={el => projectRefs.current[project.id] = el}
                    className={styles.projectItem}
                    data-project-item="true"
                    style={{ 
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      willChange: 'transform, opacity, filter'
                    }}
                  >
                    <div className={styles.projectNumber}>{project.number}</div>
                    
                    <div className={styles.projectImageContainer}>
                      <div className={styles.projectImageCircle}>
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className={styles.projectThumbnail}
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
                    </div>
                    
                    <button 
                      className={styles.projectLink}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <span>Ver proyecto</span>
                      <ArrowRight size={18} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sección 3: About Preview */}
        <section className={styles.section}>
          <div className={styles.aboutContainer} ref={aboutContainerRef}>
            <div className={styles.aboutHeader}>
              <h2 className={styles.sectionTitle}>SOBRE MÍ</h2>
              <p className={styles.aboutDescription}>
              Arquitecta apasionada por el diseño interior y el uso sostenible de materiales. Busco crear espacios que inspiren, brinden bienestar y respondan con sensibilidad a necesidades reales.
              </p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>8</span>
                  <p className={styles.statLabel}>Proyectos academicos</p>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>4</span>
                  <p className={styles.statLabel}>Años experiencia</p>
                </div>
              </div>
              
              {/* Indicador de scroll para Sobre mí */}
              {currentSection === 2 && (
                <div 
                  className={styles.scrollIndicator}
                  style={{ 
                    opacity: showScrollIndicator ? 1 : 0,
                    transform: `translateX(-50%) translateY(${showScrollIndicator ? '0' : '20px'})`
                  }}
                >
                  <span>Desliza para conocer más</span>
                  <div className={styles.scrollArrow}>
                    <ChevronRight size={24} style={{ transform: 'rotate(90deg)' }} />
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.aboutContent}>
              {/* Sección 1: Foto y bio personal */}
              <div className={styles.aboutSection} data-animate="true">
                <div className={styles.aboutImageWrapper} data-animate-delay="0">
                  <div className={styles.abstractShape1}></div>
                  <img 
                    src="/images/sidney.png" 
                    alt="Sidney Kylie - Arquitecta"
                    className={styles.cutoutImage}
                  />
                </div>
                <div className={styles.aboutText}>
                  <h3 className={styles.aboutSubtitle} data-animate-delay="0.1">Mi historia</h3>
                  <p data-animate-delay="0.2">
                  Desde muy joven, descubrí en la arquitectura una forma de entender el mundo. 
                  Las estructuras, los espacios y los detalles no eran solo objetos a mi alrededor, sino piezas de un lenguaje que deseaba aprender a dominar.
                  </p>
                  <p data-animate-delay="0.3">
                  Mi formación en el Tecnológico de Monterrey me dio las bases técnicas para proyectar y diseñar, mientras que mi participación en grupos estudiantiles y actividades cocurriculares fortaleció mi liderazgo y compromiso social.
                   Experiencias como el servicio social en Impulso Urbano y estancias en Francia y Canadá reafirmaron mi visión de una arquitectura sensible, incluyente y consciente.
                  </p>
                  <p data-animate-delay="0.4">
                  Hoy, como arquitecta, me apasiona el diseño de interiores y el uso de materiales sostenibles. 
                  Creo en la arquitectura como un vehículo para mejorar la vida de las personas: no solo se trata de construir espacios, sino de crear atmósferas que reflejen historias, valores y sueños. 
                  Cada proyecto es para mí una nueva oportunidad de unir creatividad, técnica y propósito.
                  </p>
                </div>
              </div>
              
              {/* Sección 2: Experiencia y render */}
              <div className={`${styles.aboutSection} ${styles.aboutSectionReverse}`} data-animate="true">
                <div className={styles.aboutText}>
                  <h3 className={styles.aboutSubtitle} data-animate-delay="0.1">Experiencia profesional</h3>
                  <div className={styles.experience}>
                    <div className={styles.experienceItem} data-animate-delay="0.2">
                      <span className={styles.experienceYear}>2020 - Presente</span>
                      <h4>Fundadora y Directora Creativa</h4>
                      <p>SK Studio - Diseño Arquitectónico</p>
                    </div>
                    <div className={styles.experienceItem} data-animate-delay="0.3">
                      <span className={styles.experienceYear}>2018 - 2020</span>
                      <h4>Arquitecta Senior</h4>
                      <p>Legorreta + Legorreta</p>
                    </div>
                    <div className={styles.experienceItem} data-animate-delay="0.4">
                      <span className={styles.experienceYear}>2016 - 2018</span>
                      <h4>Diseñadora de Interiores</h4>
                      <p>Niz + Chauvet Arquitectos</p>
                    </div>
                  </div>
                </div>
                <div className={styles.aboutImageWrapper} data-animate-delay="0">
                  <div className={styles.abstractShape2}></div>
                  <img 
                    src="/images/edificio.png"
                    alt="Render arquitectónico"
                    className={`${styles.cutoutImage} ${styles.buildingImage}`}
                  />
                </div>
              </div>
              
              {/* Sección 3: Filosofía y proceso */}
              <div className={styles.aboutSection} data-animate="true">
                <div className={styles.aboutImageWrapper} data-animate-delay="0">
                  <div className={styles.abstractShape3}></div>
                  <img 
                    src="/images/plantas.png"
                    alt="Proceso creativo"
                    className={styles.cutoutImage}
                  />
                </div>
                <div className={styles.aboutText}>
                  <h3 className={styles.aboutSubtitle} data-animate-delay="0.1">Filosofía de diseño</h3>
                  <p data-animate-delay="0.2">
                  Creo en un diseño sensible que conecta con las personas y su entorno. Mi enfoque nace de la experiencia práctica y el compromiso social, y se basa en:
                  </p>
                  <ul className={styles.philosophyList}>
                    <li data-animate-delay="0.3"><strong>Interiorismo consciente:</strong> Diseño con intención, pensando en cómo se vive cada espacio.</li>
                    <li data-animate-delay="0.4"><strong>Materiales sostenibles:</strong> Elijo materiales que respetan al planeta y envejecen con dignidad.</li>
                    <li data-animate-delay="0.5"><strong>Funcionalidad empática:</strong>Cada solución responde a una necesidad real con sensibilidad.</li>
                    <li data-animate-delay="0.6"><strong>Aprendizaje continuo:</strong> Mejoro cada proyecto con lo aprendido en obra, servicio y mundo.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 4: Contact */}
        <section className={styles.section}>
          <div className={styles.contactContent}>
            <h2 className={styles.sectionTitle}>CONTACTO</h2>
            <p className={styles.contactDescription}>
              ¿Tienes un proyecto en mente? Hablemos.
            </p>
            <div className={styles.contactInfo}>
              <p>sidneykylie@icloud.com</p>
              <p>+52 81 2666 5523</p>
              <p>Monterrey, Nuevo Leon, México</p>
            </div>
            <button className={styles.ctaButton}>
              ENVIAR MENSAJE
            </button>
          </div>
        </section>
        </div>
      </div>

      {/* Hint de navegación */}
      {currentSection === 0 && (
        <div className={styles.scrollHint}>
          <span>Presiona las teclas para navegar</span>
          <ChevronRight size={20} />
        </div>
      )}

    </div>
    
    {/* Project Detail Modal */}
    {selectedProject && (
      <div 
        className={styles.projectModalWrapper}
        style={{
          pointerEvents: expandingProject ? 'none' : 'auto'
        }}
      >
        <ProjectDetail 
          projectId={selectedProject} 
          onClose={handleCloseProject}
          isModal={true}
        />
      </div>
    )}
    
    {/* Expanding circle transition - must be last to appear on top of everything */}
    {expandingProject && (
      <div 
        className={`${styles.expandingCircle} ${styles[expandingProject.phase]}`}
        style={{
          '--initial-x': `${expandingProject.x}px`,
          '--initial-y': `${expandingProject.y}px`,
          '--initial-size': `${expandingProject.width}px`,
          '--target-x': `${expandingProject.targetX}px`,
          '--target-y': `${expandingProject.targetY}px`,
          '--origin-x': `${expandingProject.originX || expandingProject.x}px`,
          '--origin-y': `${expandingProject.originY || expandingProject.y}px`,
          zIndex: 10000 // Ensure it's above the modal
        }}
      />
    )}
    </ClickSpark>
  );
};

export default LandingPage;