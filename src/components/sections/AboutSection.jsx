import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import styles from '../../styles/LandingPage.module.css';
import { useReducedMotion } from '../../hooks';

/**
 * About section with scroll animations and GSAP enhancements
 */
const AboutSection = ({
  containerRef,
  showScrollIndicator,
  isActive,
}) => {
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const statsRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const hasAnimated = useRef(false);

  // Animate header when section becomes active
  useEffect(() => {
    if (prefersReducedMotion || !isActive || hasAnimated.current) return;

    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Animate title with character split
      if (titleRef.current) {
        const chars = titleRef.current.textContent.split('');
        titleRef.current.innerHTML = chars
          .map((char) => `<span class="${styles.animChar}">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('');

        const charElements = titleRef.current.querySelectorAll(`.${styles.animChar}`);
        gsap.set(charElements, { opacity: 0, y: 30 });

        tl.to(charElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
        }, 0);
      }

      // Animate description
      if (descriptionRef.current) {
        gsap.set(descriptionRef.current, { opacity: 0, y: 20 });
        tl.to(descriptionRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
        }, 0.3);
      }

      // Animate stats with counter effect
      if (statsRef.current) {
        const statNumbers = statsRef.current.querySelectorAll(`.${styles.statNumber}`);
        const statLabels = statsRef.current.querySelectorAll(`.${styles.statLabel}`);

        gsap.set([statNumbers, statLabels], { opacity: 0, y: 20 });

        tl.to(statNumbers, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
        }, 0.5);

        tl.to(statLabels, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
        }, 0.6);

        // Animate number counting
        statNumbers.forEach((num) => {
          const target = parseInt(num.textContent);
          gsap.fromTo(num,
            { textContent: 0 },
            {
              textContent: target,
              duration: 1.5,
              delay: 0.5,
              ease: 'power2.out',
              snap: { textContent: 1 },
            }
          );
        });
      }
    }, headerRef);

    return () => ctx.revert();
  }, [isActive, prefersReducedMotion]);

  return (
    <section className={styles.section}>
      <div className={styles.aboutContainer} ref={containerRef}>
        <div className={styles.aboutHeader} ref={headerRef}>
          <h2 className={styles.sectionTitle} ref={titleRef}>SOBRE MÍ</h2>
          <p className={styles.aboutDescription} ref={descriptionRef}>
            Arquitecta apasionada por el diseño interior y el uso sostenible de
            materiales. Busco crear espacios que inspiren, brinden bienestar y
            respondan con sensibilidad a necesidades reales.
          </p>
          <div className={styles.stats} ref={statsRef}>
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
          {isActive && (
            <div
              className={styles.scrollIndicator}
              style={{
                opacity: showScrollIndicator ? 1 : 0,
                transform: `translateX(-50%) translateY(${showScrollIndicator ? '0' : '20px'})`,
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
              <h3 className={styles.aboutSubtitle} data-animate-delay="0.1">
                Mi historia
              </h3>
              <p data-animate-delay="0.2">
                Desde muy joven, descubrí en la arquitectura una forma de entender
                el mundo. Las estructuras, los espacios y los detalles no eran
                solo objetos a mi alrededor, sino piezas de un lenguaje que
                deseaba aprender a dominar.
              </p>
              <p data-animate-delay="0.3">
                Mi formación en el Tecnológico de Monterrey me dio las bases
                técnicas para proyectar y diseñar, mientras que mi participación
                en grupos estudiantiles y actividades cocurriculares fortaleció mi
                liderazgo y compromiso social. Experiencias como el servicio
                social en Impulso Urbano y estancias en Francia y Canadá
                reafirmaron mi visión de una arquitectura sensible, incluyente y
                consciente.
              </p>
              <p data-animate-delay="0.4">
                Hoy, como arquitecta, me apasiona el diseño de interiores y el uso
                de materiales sostenibles. Creo en la arquitectura como un
                vehículo para mejorar la vida de las personas: no solo se trata de
                construir espacios, sino de crear atmósferas que reflejen
                historias, valores y sueños. Cada proyecto es para mí una nueva
                oportunidad de unir creatividad, técnica y propósito.
              </p>
            </div>
          </div>

          {/* Sección 2: Experiencia y render */}
          <div
            className={`${styles.aboutSection} ${styles.aboutSectionReverse}`}
            data-animate="true"
          >
            <div className={styles.aboutText}>
              <h3 className={styles.aboutSubtitle} data-animate-delay="0.1">
                Experiencia profesional
              </h3>
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
              <h3 className={styles.aboutSubtitle} data-animate-delay="0.1">
                Filosofía de diseño
              </h3>
              <p data-animate-delay="0.2">
                Creo en un diseño sensible que conecta con las personas y su
                entorno. Mi enfoque nace de la experiencia práctica y el
                compromiso social, y se basa en:
              </p>
              <ul className={styles.philosophyList}>
                <li data-animate-delay="0.3">
                  <strong>Interiorismo consciente:</strong> Diseño con intención,
                  pensando en cómo se vive cada espacio.
                </li>
                <li data-animate-delay="0.4">
                  <strong>Materiales sostenibles:</strong> Elijo materiales que
                  respetan al planeta y envejecen con dignidad.
                </li>
                <li data-animate-delay="0.5">
                  <strong>Funcionalidad empática:</strong>Cada solución responde a
                  una necesidad real con sensibilidad.
                </li>
                <li data-animate-delay="0.6">
                  <strong>Aprendizaje continuo:</strong> Mejoro cada proyecto con
                  lo aprendido en obra, servicio y mundo.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
