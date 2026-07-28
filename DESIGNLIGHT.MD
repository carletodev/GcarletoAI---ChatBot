---
name: Technical Minimalist Light
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006780'
  on-secondary: '#ffffff'
  secondary-container: '#76dcff'
  on-secondary-container: '#006077'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#b7eaff'
  secondary-fixed-dim: '#6cd3f7'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e61'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
  surface-l0: '#F8F9FA'
  surface-l1: '#F1F3F5'
  surface-l2: '#E9ECEF'
  text-primary: '#1A1A21'
  text-secondary: rgba(75, 85, 99, 0.6)
  border-subtle: '#E2E8F0'
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
    fontFamily: jetbrainsMono
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

The design system is a light-mode evolution of the "Technical Minimalist" aesthetic. It preserves the professional, IDE-inspired structure while shifting the atmosphere from a dark "obsidian" environment to one of "Intelligent Calm" and high-contrast clarity. The narrative is defined by precision, utility, and a distraction-free workspace.

The style is a hybrid of **Minimalism** and **Modern Corporate**, focusing on high-performance utility. It leverages clean off-white surfaces, crisp indigo primary accents, and cyan technical highlights. The emotional response should be one of focused productivity, similar to a high-end documentation site or a modern code editor’s light theme.

Key design pillars:
- **Architectural Clarity:** A structured, grid-based layout that prioritizes content and hierarchy.
- **Tonal Depth:** Replacing heavy shadows with subtle shifts in surface grays to define spatial relationships.
- **Refined Precision:** Utilizing specific geometric radii and purposeful micro-interactions to signal system intelligence.

## Colors

The palette is engineered for maximum legibility and reduced eye strain in bright environments. It moves away from pure white (#FFFFFF) to a sophisticated off-white base to soften the visual impact.

- **Primary (Deep Indigo):** Used for branding, active states, and as the visual anchor for the assistant's personality. It has been darkened to ensure AA/AAA accessibility on light surfaces.
- **Accent (Technical Cyan):** Used for micro-interactions, success states, and highlighting specific technical or code-related metadata.
- **Neutral Scale:** Built on a "Cool Gray" foundation. The layering (L0, L1, L2) provides the primary means of distinguishing between the workspace, sidebars, and interactive cards.
- **Typography:** Text uses a high-contrast near-black for primary content. Secondary information uses a muted gray with 60% opacity to establish a clear information hierarchy without losing legibility.

## Typography

The typography system is built entirely on **Inter** for UI and **JetBrains Mono** for technical content. This combination ensures a neutral, utilitarian feel that mirrors professional developer environments.

- **Headlines:** Feature tight letter-spacing to create a compact, modern look that commands attention without feeling bulky.
- **Body:** Optimized for readability in long-form AI responses. The 1.6 line-height is critical to prevent fatigue during extended reading sessions.
- **Labels:** Used for metadata, timestamps, and sidebar navigation items. These are rendered in medium weight to remain legible at smaller sizes.
- **Code:** All technical outputs, terminal snippets, or data structures must be rendered in JetBrains Mono to maintain the "Technical" part of the brand promise.

## Layout & Spacing

The system follows a **Fixed-Fluid Hybrid** model designed to focus the user’s attention on the center of the "Stage."

- **The Sidebar:** A 280px fixed-width container for navigation and history. It uses `surface-l1` to distinguish itself from the main workspace.
- **The Stage:** The central content area, capped at 800px. This constraint ensures that line lengths remain within the optimal 45–75 character range for readability.
- **The Input:** A floating or anchored input container within the Stage, typically positioned at the bottom with consistent padding.

Spacing is strictly managed on an 8px base grid. Use `stack-md` (16px) for standard component spacing and `gutter` (24px) for outer page margins.

## Elevation & Depth

In light mode, elevation is primarily communicated through **Tonal Layering** and very subtle, high-diffusion shadows.

- **Level 0 (Base):** #F8F9FA. The primary background for the entire application.
- **Level 1 (Navigation):** #F1F3F5. Used for the persistent sidebar and secondary navigation panels.
- **Level 2 (Containers):** #E9ECEF or pure white (#FFFFFF) with a soft shadow (0px 4px 12px rgba(0,0,0,0.05)). Used for chat cards and the primary input field.
- **Level 3 (Overlays):** White surface with a defined 1px border (#E2E8F0) and a more pronounced shadow (0px 8px 24px rgba(0,0,0,0.08)).

Avoid heavy, dark shadows. The goal is to make elements look like they are slightly lifted off the page by soft, ambient light.

## Shapes

The "Soft-Geometric" language is defined by a consistent 12px (`0.75rem`) corner radius. This choice balances the rigidity of technical tools with the approachability of a personal assistant.

- **Containers & Cards:** Always use the 12px standard.
- **Buttons:** Primary buttons follow the 12px standard, while secondary buttons or utility chips can occasionally use a pill-shape (full radius) to differentiate them.
- **Sidebar Items:** Use a slightly smaller 8px radius for internal selection states to maintain visual nested harmony.

## Components

### Buttons
- **Primary:** Solid Deep Indigo (#4F46E5) with white text. 12px radius. On hover, a subtle cyan glow or brightness shift.
- **Secondary:** `surface-l2` background or a 1px border (#E2E8F0) with `text-primary`. 

### Input Field
- **Structure:** Multi-line auto-expanding field with 12px radius.
- **Style:** Background should be pure white (#FFFFFF) with a 1px border (#E2E8F0). On focus, the border transitions to Primary Indigo.
- **Action:** A Cyan (#0891B2) "Send" icon that appears at 30% opacity when empty and 100% opacity when text is present.

### Message Architecture
- **User Messages:** Right-aligned, utilizing a `surface-l1` container to subtly group the text.
- **Assistant Messages:** Left-aligned, no background container. Instead, use a vertical Indigo accent line (3px wide) on the far left to define the assistant's zone.

### Chips & Tags
- **Quick Suggestions:** 12px radius, `surface-l1` background, `text-secondary` color. On hover, the text shifts to Primary Indigo.

### Interactive States
- **Transitions:** All color and surface changes must use `cubic-bezier(0.4, 0, 0.2, 1)` with a 150ms duration for hover and 300ms for layout shifts.