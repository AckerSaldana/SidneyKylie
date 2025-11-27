import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LandingPage from './pages/LandingPage.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import { CustomCursor, GrainOverlay, TransitionOverlay } from './components/effects'
import { TransitionProvider, useTransition } from './contexts'
import './App.css'

gsap.registerPlugin(ScrollTrigger);

// ProjectDetail uses native scroll for GSAP ScrollTrigger pin compatibility
// Lenis smooth scroll conflicts with ScrollTrigger's pin feature

// Route change handler - cleans up ScrollTrigger, resets scroll, and triggers reveals
const RouteChangeHandler = () => {
  const location = useLocation();
  const { needsReveal, triggerReveal } = useTransition();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Kill all ScrollTrigger instances on route change
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Reset scroll position
    window.scrollTo(0, 0);

    // If we have an active transition that needs reveal, trigger it
    // This handles both entry (from LandingPage to ProjectDetail) and exit (from ProjectDetail to LandingPage)
    if (needsReveal() && prevPathRef.current !== location.pathname) {
      const revealTimer = setTimeout(() => {
        triggerReveal();
      }, 50);

      prevPathRef.current = location.pathname;
      return () => clearTimeout(revealTimer);
    }

    // Refresh ScrollTrigger after a brief delay to allow new page to render
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    prevPathRef.current = location.pathname;
    return () => clearTimeout(refreshTimer);
  }, [location.pathname, needsReveal, triggerReveal]);

  return null;
};

function App() {
  return (
    <TransitionProvider>
      <Router>
        {/* Route change handler */}
        <RouteChangeHandler />

        {/* Global effects */}
        <CustomCursor />
        <GrainOverlay opacity={0.025} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>

        {/* Global circle transition overlay - renders above routes */}
        <TransitionOverlay />
      </Router>
    </TransitionProvider>
  )
}

export default App