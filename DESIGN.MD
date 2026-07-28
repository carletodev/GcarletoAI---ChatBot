---
name: Technical Minimalist Assistant
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#5de6ff'
  on-secondary: '#00363e'
  secondary-container: '#00cbe6'
  on-secondary-container: '#00515d'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#a2eeff'
  secondary-fixed-dim: '#2fd9f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  headline-h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-h1-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-h2:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-main:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 280px
  content-max-width: 800px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is centered on a "Technical Minimalist" aesthetic, specifically tailored for a personal portfolio AI assistant. It avoids the generic "chat bubble" tropes of contemporary AI tools, instead opting for a sophisticated, IDE-inspired structure that emphasizes utility and clarity. 

The visual narrative is one of high-performance precision. It leverages the contrast between deep obsidian surfaces and vibrant, neon-tinted accents to create an environment that feels both futuristic and professional. The emotional response is intended to be "Intelligent Calm"—where the user feels the power of the AI through snappy interactions and a clean, undistracted interface. 

Design pillars include:
- **Spatial Hierarchy:** Using depth and layering rather than heavy borders.
- **Micro-Interactions:** Subtle glows and state changes that signal the AI's "thought" process.
- **Architectural Layout:** A structured, grid-based approach that mimics high-end developer tools.

## Colors
The palette is engineered for high legibility in low-light environments. 

- **Primary (Indigo):** Used for branding, primary action states, and identifying "Assistant" messages.
- **Accent (Cyan):** Reserved for interaction cues, progress indicators, and highlighting code or technical snippets.
- **Neutral Scale:** The background and surface colors are deep, cool-toned grays that prevent eye strain while providing enough contrast to distinguish between the persistent sidebar and the active workspace.
- **Text:** Primary text uses a high-contrast off-white to ensure maximum readability, while secondary text should drop to a 60% opacity to maintain hierarchy.

## Typography
The system relies on **Inter** for all UI elements to maintain a clean, neutral, and highly legible interface. 

- **Headlines:** Use tight letter-spacing for larger headers to give a modern, "compacted" feel.
- **Body:** The 15px body size provides a comfortable reading experience for long-form AI responses, with a generous 1.6 line height to prevent text density fatigue.
- **Labels:** Small, medium-weight labels are used for sidebar items, timestamps, and metadata.
- **Technical Elements:** While not part of the primary variable set, the use of a monospaced font (like JetBrains Mono) is required for code blocks or data outputs within the assistant's responses.

## Layout & Spacing
This design system utilizes a **Fixed-Fluid Hybrid** model. 

1.  **The Sidebar:** A fixed 280px navigation drawer on the left for history and navigation. On mobile, this transitions to a hidden off-canvas menu.
2.  **The Stage:** A centered chat/workspace area with a maximum width of 800px. This ensures text lines don't become too long to read comfortably.
3.  **The Input:** A floating or anchored input bar at the bottom of the Stage, maintaining consistent padding from the bottom of the viewport.

The spacing rhythm is built on an 8px base grid. Use 24px margins for the primary container and 16px gutters between modular components.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Background):** #0F0F13. The base canvas.
- **Level 1 (Sidebar/Secondary):** #1A1A21. Slightly lifted.
- **Level 2 (Cards/Input):** Surface color with a very soft, large-radius shadow (0px 8px 24px rgba(0,0,0,0.5)).
- **Level 3 (Modals/Popovers):** Surface color with a thin 1px border (#3F3F46) to define edges against other dark surfaces, accompanied by an Indigo-tinted shadow.

Avoid hard drop shadows. Elevation should feel like objects are floating in a void rather than sitting on a physical table.

## Shapes
The shape language is consistently "Soft-Geometric." 

The standard radius for cards, input fields, and the sidebar is **12px**. This specific radius bridges the gap between a "tech" look and a "friendly" look. 
- **Buttons:** 12px or fully pill-shaped for secondary actions.
- **Selection States:** Use 8px rounded corners for items inside the sidebar.
- **Images/Media:** Should follow the 12px standard to maintain system harmony.

## Components
### Buttons
- **Primary:** Solid Indigo (#6366F1) background with White text. No border. On hover, a subtle Cyan glow.
- **Secondary:** Surface color background with a 1px border (#3F3F46).

### Input Field
- The main chat input should be a multi-line auto-expanding field.
- Background: #1A1A21.
- Border: 1px transparent, transitioning to 1px Indigo on focus.
- Include a Cyan "Send" icon that remains dimmed until text is entered.

### Message Cards
- **User Messages:** Right-aligned, subtle surface background, no border.
- **Assistant Messages:** Left-aligned, no background, but marked with a small Indigo vertical line or icon to the left to indicate the source.

### Chips & Tags
- Used for "Quick Suggestions" or technical categories.
- Small text, 12px radius, #1A1A21 background with a Cyan (#22D3EE) text color.

### Transitions
- Use `cubic-bezier(0.4, 0, 0.2, 1)` for all surface transitions and color fades.
- Duration for hover states: 150ms. 
- Duration for panel entries: 300ms.