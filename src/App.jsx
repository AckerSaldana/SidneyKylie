import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import { SmoothScrollProvider, CustomCursor, GrainOverlay } from './components/effects'
import './App.css'

// Wrapper for ProjectDetail with smooth scroll
const ProjectDetailWithSmoothScroll = () => (
  <SmoothScrollProvider>
    <ProjectDetail />
  </SmoothScrollProvider>
);

function App() {
  return (
    <Router>
      {/* Global effects */}
      <CustomCursor />
      <GrainOverlay opacity={0.025} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/project/:id" element={<ProjectDetailWithSmoothScroll />} />
      </Routes>
    </Router>
  )
}

export default App