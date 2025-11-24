# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sidney Kylie Portfolio** - A React portfolio website for an architect (Sidney Kylie), featuring architectural project showcases with advanced scroll animations and interactive transitions. The site is primarily in Spanish and focuses on interior design and sustainable architecture projects.

## Development Commands

```bash
npm run dev        # Start development server (Vite) - http://localhost:5173
npm run build      # Build for production (outputs to /dist)
npm run lint       # Run ESLint for code quality checks
npm run preview    # Preview production build locally
```

## Project Structure

```
/
├── public/
│   ├── images/           # Static images (logo, profile photos, building renders)
│   ├── projects/         # Project-specific assets
│   │   └── casa-1/       # Casa Terra 027 project
│   │       ├── photos/   # Project photographs
│   │       ├── plans/    # Architectural floor plans
│   │       └── renders/  # 3D renders
│   └── video/            # Background video assets
├── src/
│   ├── components/       # Reusable React components
│   │   └── ClickSpark.jsx    # Blue spark animation on click (canvas-based)
│   ├── pages/            # Page-level components
│   │   ├── LandingPage.jsx   # Main page with horizontal scroll sections
│   │   └── ProjectDetail.jsx # Project showcase with sticky scroll effect
│   ├── styles/           # CSS Modules
│   │   ├── LandingPage.module.css
│   │   └── ProjectDetail.module.css
│   ├── App.jsx           # Root component with React Router
│   ├── App.css           # Global app styles (minimal)
│   ├── index.css         # Base global styles
│   └── main.jsx          # Application entry point
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── eslint.config.js      # ESLint configuration (flat config format)
```

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI framework |
| Vite | 6.3.5 | Build tool and dev server |
| React Router DOM | 7.6.1 | Client-side routing |
| GSAP | 3.13.0 | Animation library (available but CSS animations preferred) |
| Tailwind CSS | 4.1.7 | Utility CSS framework |
| lucide-react | 0.511.0 | Icon library |

## Architecture & Patterns

### Routing Structure
- `/` - Landing page (horizontal scroll with 4 sections)
- `/project/:id` - Project detail page (also used as modal overlay)

### Component Patterns

**LandingPage.jsx** - Main page with horizontal scrolling:
- Uses `currentSection` state (0-3) for navigation
- Horizontal scroll achieved via CSS `transform: translateX(-${section * 100}vw)`
- Contains 4 sections: Hero, Projects, About, Contact
- Project list with vertical carousel effect
- Circle expansion transition to project detail

**ProjectDetail.jsx** - Dual-mode component:
- Can render as standalone page (`/project/:id`) or as modal overlay
- Accepts `projectId`, `onClose`, and `isModal` props
- Sticky image scroll effect during title reveal
- Project data is hardcoded in component (currently only project ID `1` has full data)

**ClickSpark.jsx** - Global click effect:
- Canvas-based animation that creates blue spark bursts on click
- Wraps entire app content
- Uses `requestAnimationFrame` for smooth animation

### State Management
- Local component state with `useState` and `useRef`
- No global state management library
- Scroll position tracked via event listeners

## Styling Conventions

### CSS Modules
- Each page has a corresponding `.module.css` file
- Class names imported as `styles` object: `className={styles.heroSection}`
- Global styles in `index.css` (minimal reset and body settings)

### Custom Color Palette (Tailwind)
```javascript
'arch-gray': {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
}
```

### Accent Color
- Primary accent: `#74C5FF` (light blue)
- Used for: hover states, subtitle text, expanding circle transitions, abstract shapes

### Typography
- **Font**: Google Font "Delius" (cursive)
- **Line height convention**: Use 1.2x font size for headings, 1.8 for body text
- **Letter spacing**: Titles use 0.1em-0.3em, body text uses 0.01-0.05em

### Design Patterns
- Hidden scrollbars globally while maintaining scroll functionality
- Frosted glass effect using `backdrop-filter: blur()`
- Geometric decorations with thin borders
- Image circles with zoom-on-hover effects

## Animation Patterns

### Scroll Animations
1. **Horizontal Section Scroll**: CSS transition on `transform: translateX()`
2. **Vertical Carousel Effect**: Scale and opacity based on distance from center
3. **Sticky Image Scroll**: `position: fixed` switches to `absolute` based on scroll progress
4. **Apple-style Reveal**: Elements animate in based on `--progress` CSS custom property

### Transition Patterns
1. **Circle Expansion**: Project click triggers expanding circle from thumbnail position
2. **Letter Float**: Individual letters animate with staggered delays
3. **Scroll Indicators**: Bounce and fade animations

### Key Animation Values
```css
/* Common easing */
cubic-bezier(0.4, 0, 0.2, 1)     /* Standard ease */
cubic-bezier(0.25, 0.46, 0.45, 0.94)  /* Smooth transitions */
cubic-bezier(0.76, 0, 0.24, 1)  /* Dramatic ease */

/* Common durations */
0.3s - 0.4s  /* UI feedback */
0.6s - 0.8s  /* Page transitions */
2s - 8s      /* Ambient animations */
```

## Key Implementation Details

### Scroll Handling
- Custom scroll implementations using `window.scrollY` with multiple event listeners
- `{ passive: true }` for performance on scroll listeners
- Cross-browser scrollbar hiding using `-webkit-scrollbar`, `scrollbar-width: none`, `-ms-overflow-style: none`

### ProjectDetail Sticky Scroll
```javascript
const titleProgress = Math.min(Math.max(scrollY / windowHeight, 0), 1);
// Image stays fixed while titleProgress < 1, then becomes absolute
```

### Circle Expansion Transition
- Calculates farthest corner from click point
- Uses CSS custom properties (`--initial-x`, `--target-x`, etc.)
- Multiple animation phases: `expanding`, `contracting`, `exitExpanding`, `exitContracting`

### Responsive Breakpoints
- `768px` - Mobile breakpoint (grid changes, navigation hamburger)
- `1024px` - Tablet breakpoint (content grids adjust)

## Code Conventions

### File Naming
- Components: PascalCase (`LandingPage.jsx`, `ClickSpark.jsx`)
- Styles: PascalCase with `.module.css` suffix
- Assets: kebab-case (`background-video.mp4`, `photo-1.png`)

### Component Structure
```jsx
const Component = ({ props }) => {
  // 1. State declarations
  // 2. Refs
  // 3. useEffect hooks
  // 4. Event handlers
  // 5. Return JSX
};
export default Component;
```

### Comments
- Spanish comments in existing code (maintain consistency)
- Use `//` for inline comments, `/* */` for section headers

## Project Data

Projects are defined in `LandingPage.jsx` (preview list) and `ProjectDetail.jsx` (full details). Currently only project ID `1` (Casa Terra 027) has complete data with:
- Main hero image
- 4 renders with captions
- 9 photos with captions
- 3 floor plans
- Technical specifications
- Full description and concept text

## Content Language

- UI text is in Spanish
- Section titles: "PROYECTOS DESTACADOS", "SOBRE MÍ", "CONTACTO"
- Maintain Spanish for user-facing text when editing
