# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev        # Start development server (Vite)
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Architecture Overview

This is a React portfolio website built with Vite, featuring architectural project showcases with advanced scroll animations.

### Key Technologies
- **React 19.1.0** with Vite 6.3.5
- **React Router DOM v7.6.1** for navigation
- **CSS Modules** for component styling
- **GSAP 3.13.0** available for animations
- **Tailwind CSS v4.1.7** configured (custom arch-gray palette)

### Project Structure
- `/src/pages/` - Page components
  - `LandingPage.jsx` - Main page with horizontal scroll sections
  - `ProjectDetail.jsx` - Project showcase with sticky scroll effect
- `/src/components/` - Reusable components
  - `ClickSpark.jsx` - Blue spark animation on click
- `/src/styles/` - CSS modules for each component

### Routing
- `/` - Landing page
- `/project/:id` - Project detail page with circle expansion transition

### Key Implementation Details

1. **Scroll Behavior**: Custom scroll implementations using `window.scrollY` with multiple event listeners for cross-browser compatibility

2. **ProjectDetail Sticky Scroll**: Two-phase approach where image stays fixed during title reveal (scrollProgress < 1), then becomes static

3. **Hidden Scrollbars**: Implemented globally in CSS for all browsers while maintaining scroll functionality

4. **Line Height Convention**: Use 1.2x font size for better design practices

5. **Custom Fonts**: Google Font "Delius" loaded via CSS import