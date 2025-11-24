import React from 'react';
import { Menu, X } from 'lucide-react';
import styles from '../../styles/LandingPage.module.css';

/**
 * Navigation component with logo, desktop links, and mobile menu
 */
const Navigation = ({
  currentSection,
  isMenuOpen,
  onMenuToggle,
  onNavigate,
  visible = true,
}) => {
  const navItems = [
    { index: 0, label: 'INICIO' },
    { index: 1, label: 'PROYECTOS' },
    { index: 2, label: 'SOBRE MÍ' },
    { index: 3, label: 'CONTACTO' },
  ];

  return (
    <nav className={`${styles.nav} ${visible ? styles.visible : ''}`}>
      <div className={styles.navContent}>
        {/* Logo */}
        <div
          className={styles.logoContainer}
          onClick={() => onNavigate(0)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate(0)}
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
          {navItems.map((item) => (
            <button
              key={item.index}
              onClick={() => onNavigate(item.index)}
              className={currentSection === item.index ? styles.active : ''}
              aria-current={currentSection === item.index ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className={styles.menuButton}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu} role="menu">
          {navItems.map((item) => (
            <button
              key={item.index}
              onClick={() => onNavigate(item.index)}
              role="menuitem"
              className={currentSection === item.index ? styles.active : ''}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
