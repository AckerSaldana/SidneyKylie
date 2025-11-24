import React from 'react';
import styles from '../../styles/LandingPage.module.css';

/**
 * Contact section
 */
const ContactSection = () => {
  return (
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
        <button className={styles.ctaButton}>ENVIAR MENSAJE</button>
      </div>
    </section>
  );
};

export default ContactSection;
