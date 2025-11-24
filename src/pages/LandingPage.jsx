import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from '../styles/LandingPage.module.css';

// Components
import ClickSpark from '../components/ClickSpark';
import ProjectDetail from './ProjectDetail';
import { Navigation, SectionIndicators } from '../components/layout';
import { CircleTransition } from '../components/effects';
import {
  HeroSection,
  ProjectsSection,
  AboutSection,
  ContactSection,
} from '../components/sections';

// Data
import { getProjectPreviews } from '../data/projects';

// Hooks
import { useKeyboardNavigation, useLenisContainer, useReducedMotion } from '../hooks';

const LandingPage = () => {
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [expandingProject, setExpandingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Refs
  const projectsContainerRef = useRef(null);
  const aboutContainerRef = useRef(null);
  const projectRefs = useRef({});

  // Hooks
  const prefersReducedMotion = useReducedMotion();

  // Data
  const projects = getProjectPreviews();

  // Navigation handler (defined early for use in hooks)
  const scrollToSection = useCallback((index) => {
    setCurrentSection(index);
    setIsMenuOpen(false);

    // Reset scroll when leaving sections
    if (index !== 1 && projectsContainerRef.current) {
      projectsContainerRef.current.scrollTop = 0;
    }
    if (index !== 2 && aboutContainerRef.current) {
      aboutContainerRef.current.scrollTop = 0;
    }

    setShowScrollIndicator(true);
  }, []);

  // Keyboard navigation
  useKeyboardNavigation({
    currentIndex: currentSection,
    maxIndex: 3,
    onChange: scrollToSection,
    enabled: true,
  });

  // Premium 3D carousel scroll handler - sets CSS custom properties
  const handleProjectsScroll = useCallback(() => {
    const container = projectsContainerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    setShowScrollIndicator(scrollTop <= 50);

    // Skip 3D effects if user prefers reduced motion
    if (prefersReducedMotion) return;

    const items = container.querySelectorAll('[data-project-item]');
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.height / 2;

    items.forEach((item) => {
      // Skip items being hovered - CSS handles the reset
      if (item.matches(':hover')) {
        item.style.setProperty('--distance', '0');
        item.style.setProperty('--abs-distance', '0');
        return;
      }

      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2 - containerRect.top;
      const distance = itemCenter - containerCenter;
      const maxDistance = containerRect.height / 2;

      const normalizedDistance = Math.max(-1, Math.min(1, distance / maxDistance));
      const absDistance = Math.abs(normalizedDistance);

      const isVisible = rect.top < containerRect.bottom && rect.bottom > containerRect.top;

      if (isVisible) {
        // Set CSS custom properties - CSS handles all 3D transforms
        item.style.setProperty('--distance', normalizedDistance.toFixed(3));
        item.style.setProperty('--abs-distance', absDistance.toFixed(3));
      }
    });
  }, [prefersReducedMotion]);

  // Lenis smooth scroll for projects carousel
  useLenisContainer({
    containerRef: projectsContainerRef,
    enabled: currentSection === 1 && !prefersReducedMotion,
    onScroll: handleProjectsScroll,
    duration: 1.4,       // Premium feel
    wheelMultiplier: 0.8, // Elegant scrolling
  });

  // Fallback scroll handler when Lenis is disabled (reduced motion or other sections)
  useEffect(() => {
    const projectsContainer = projectsContainerRef.current;
    if (!projectsContainer || currentSection !== 1) return;

    // If Lenis is disabled, use native scroll with our handler
    if (prefersReducedMotion) {
      projectsContainer.addEventListener('scroll', handleProjectsScroll, { passive: true });
      handleProjectsScroll();

      return () => {
        projectsContainer.removeEventListener('scroll', handleProjectsScroll);
      };
    }

    // Initial call to set positions
    handleProjectsScroll();
  }, [currentSection, prefersReducedMotion, handleProjectsScroll]);

  // Calculate precise bottom padding so last item can center but not scroll past
  useEffect(() => {
    const container = projectsContainerRef.current;
    if (!container || currentSection !== 1) return;

    const calculatePadding = () => {
      const projectsList = container.querySelector(`.${styles.projectsList}`);
      const items = container.querySelectorAll('[data-project-item]');
      if (!projectsList || items.length === 0) return;

      const lastItem = items[items.length - 1];
      const containerHeight = container.clientHeight;
      const lastItemHeight = lastItem.offsetHeight;

      // Padding needed = (container center) - (half of last item height)
      // This positions the last item's center at the container's center
      const paddingNeeded = Math.max(0, (containerHeight / 2) - (lastItemHeight / 2));

      projectsList.style.paddingBottom = `${paddingNeeded}px`;
    };

    // Calculate on mount and resize
    calculatePadding();
    window.addEventListener('resize', calculatePadding);

    return () => {
      window.removeEventListener('resize', calculatePadding);
    };
  }, [currentSection]);

  // About section scroll handler
  useEffect(() => {
    const aboutContainer = aboutContainerRef.current;
    if (!aboutContainer || currentSection !== 2) return;

    const handleAboutScroll = () => {
      const scrollTop = aboutContainer.scrollTop;
      setShowScrollIndicator(scrollTop <= 10);

      // Apply progress-based animations to sections
      const sections = aboutContainer.querySelectorAll('[data-animate]');

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementBottom = rect.bottom;

        const start = windowHeight * 0.9;
        const end = windowHeight * 0.1;

        if (elementTop < start && elementBottom > end) {
          const sectionProgress = 1 - (elementTop - end) / (start - end);
          const clampedProgress = Math.max(0, Math.min(1, sectionProgress));

          section.style.setProperty('--progress', clampedProgress);

          const animatedChildren = section.querySelectorAll('[data-animate-delay]');
          animatedChildren.forEach((child, index) => {
            const delay = parseFloat(child.dataset.animateDelay) || index * 0.1;
            const childProgress = Math.max(
              0,
              Math.min(1, (clampedProgress - delay) / (1 - delay))
            );
            child.style.setProperty('--child-progress', childProgress);
          });
        }
      });
    };

    aboutContainer.addEventListener('scroll', handleAboutScroll, { passive: true });
    handleAboutScroll();

    return () => {
      aboutContainer.removeEventListener('scroll', handleAboutScroll);
    };
  }, [currentSection]);

  // Project click handler
  const handleProjectClick = useCallback((projectId) => {
    const projectElement = projectRefs.current[projectId];
    if (!projectElement) return;

    const imageCircle = projectElement.querySelector(`.${styles.projectImageCircle}`);
    const rect = imageCircle.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Find farthest corner
    const corners = [
      { x: 0, y: 0 },
      { x: viewportWidth, y: 0 },
      { x: 0, y: viewportHeight },
      { x: viewportWidth, y: viewportHeight },
    ];

    let maxDistance = 0;
    let targetCorner = corners[0];

    corners.forEach((corner) => {
      const distance = Math.sqrt(
        Math.pow(corner.x - centerX, 2) + Math.pow(corner.y - centerY, 2)
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        targetCorner = corner;
      }
    });

    // Start expanding animation
    setExpandingProject({
      id: projectId,
      x: centerX,
      y: centerY,
      width: rect.width,
      height: rect.height,
      phase: 'expanding',
      targetX: targetCorner.x,
      targetY: targetCorner.y,
    });

    // Show project after expansion
    setTimeout(() => {
      setSelectedProject(projectId);
      setTimeout(() => {
        setExpandingProject((prev) => ({ ...prev, phase: 'contracting' }));
      }, 200);
    }, 400);

    // Clear animation
    setTimeout(() => {
      setExpandingProject(null);
    }, 1000);
  }, []);

  // Close project handler
  const handleCloseProject = useCallback((closeX, closeY) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const x = closeX || viewportWidth / 2;
    const y = closeY || viewportHeight / 2;

    setExpandingProject({
      id: 'exit',
      x: x,
      y: y,
      width: 40,
      height: 40,
      phase: 'exitExpanding',
      originX: viewportWidth,
      originY: 0,
      targetX: 0,
      targetY: viewportHeight,
    });

    setTimeout(() => {
      setExpandingProject((prev) => ({ ...prev, phase: 'exitContracting' }));
      setTimeout(() => {
        setSelectedProject(null);
      }, 50);
    }, 400);

    setTimeout(() => {
      setExpandingProject(null);
    }, 800);
  }, []);

  return (
    <ClickSpark>
      <div className={`${styles.container} ${styles.landingContainer}`}>
        {/* Navigation */}
        <Navigation
          currentSection={currentSection}
          isMenuOpen={isMenuOpen}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
          onNavigate={scrollToSection}
          visible={currentSection > 0}
        />

        {/* Section Indicators */}
        <SectionIndicators
          totalSections={4}
          currentSection={currentSection}
          onNavigate={scrollToSection}
        />

        {/* Sections Container */}
        <div className={styles.sectionsWrapper}>
          <div
            className={styles.sectionsContainer}
            style={{ transform: `translateX(-${currentSection * 100}vw)` }}
          >
            {/* Section 1: Hero */}
            <HeroSection onNavigateToProjects={() => scrollToSection(1)} />

            {/* Section 2: Projects */}
            <ProjectsSection
              projects={projects}
              projectRefs={projectRefs}
              containerRef={projectsContainerRef}
              showScrollIndicator={showScrollIndicator && currentSection === 1}
              onProjectClick={handleProjectClick}
            />

            {/* Section 3: About */}
            <AboutSection
              containerRef={aboutContainerRef}
              showScrollIndicator={showScrollIndicator}
              isActive={currentSection === 2}
            />

            {/* Section 4: Contact */}
            <ContactSection />
          </div>
        </div>

        {/* Scroll Hint (Hero only) */}
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
          style={{ pointerEvents: expandingProject ? 'none' : 'auto' }}
        >
          <ProjectDetail
            projectId={selectedProject}
            onClose={handleCloseProject}
            isModal={true}
          />
        </div>
      )}

      {/* Circle Transition */}
      <CircleTransition transitionState={expandingProject} />
    </ClickSpark>
  );
};

export default LandingPage;
