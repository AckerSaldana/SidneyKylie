import React from 'react';
import styles from '../../styles/LandingPage.module.css';

/**
 * Section navigation indicators (dots)
 */
const SectionIndicators = ({
  totalSections = 4,
  currentSection,
  onNavigate,
}) => {
  return (
    <div className={styles.indicators} role="tablist" aria-label="Navegación de secciones">
      {Array.from({ length: totalSections }, (_, index) => (
        <button
          key={index}
          onClick={() => onNavigate(index)}
          className={`${styles.indicator} ${currentSection === index ? styles.active : ''}`}
          role="tab"
          aria-selected={currentSection === index}
          aria-label={`Ir a sección ${index + 1}`}
          tabIndex={currentSection === index ? 0 : -1}
        />
      ))}
    </div>
  );
};

export default SectionIndicators;
