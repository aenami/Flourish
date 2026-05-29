---
name: Flourish
colors:
  surface: '#121416'
  surface-dim: '#121416'
  surface-bright: '#37393b'
  surface-container-lowest: '#0c0e10'
  surface-container-low: '#1a1c1e'
  surface-container: '#1e2022'
  surface-container-high: '#282a2c'
  surface-container-highest: '#333537'
  on-surface: '#e2e2e5'
  on-surface-variant: '#d5c3b5'
  inverse-surface: '#e2e2e5'
  inverse-on-surface: '#2f3133'
  outline: '#9d8e81'
  outline-variant: '#51453a'
  surface-tint: '#f7bb7e'
  primary: '#f7bb7e'
  on-primary: '#492900'
  primary-container: '#d9a066'
  on-primary-container: '#5e3604'
  inverse-primary: '#825422'
  secondary: '#accebf'
  on-secondary: '#17362c'
  secondary-container: '#2e4d42'
  on-secondary-container: '#9bbcae'
  tertiary: '#ebc246'
  on-tertiary: '#3d2f00'
  tertiary-container: '#cda72c'
  on-tertiary-container: '#4f3d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbd'
  primary-fixed-dim: '#f7bb7e'
  on-primary-fixed: '#2c1600'
  on-primary-fixed-variant: '#663d0b'
  secondary-fixed: '#c8eadb'
  secondary-fixed-dim: '#accebf'
  on-secondary-fixed: '#012017'
  on-secondary-fixed-variant: '#2e4d42'
  tertiary-fixed: '#ffe08b'
  tertiary-fixed-dim: '#ebc246'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#584400'
  background: '#121416'
  on-background: '#e2e2e5'
  surface-variant: '#333537'
typography:
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system is built to create a "Digital Sanctuary"—a space that feels like a physical room where users can retreat for introspection and growth. The brand personality is **tranquil, progressive, and visually alive**, moving away from cold, clinical productivity tools toward a warm, lived-in aesthetic. 

The visual style is a blend of **Glassmorphism** and **Tactile Modernism**. It utilizes the depth of an isometric perspective, translating the cozy "lo-fi" room aesthetic into a functional UI. Elements should feel like physical objects placed on a dark, polished surface, using soft natural glows and wooden textures to anchor the digital experience in something familiar and grounding.

## Colors

The palette is rooted in deep, natural tones to minimize eye strain and evoke a nighttime or forest-like calm. 

- **Foundational Neutrals:** The background uses a charcoal-to-deep-forest gradient (#121416 to #1A1C1E). 
- **Wood Accents:** Primary actions and structural highlights use warm, wooden tones (#D9A066) to provide a tactile, organic feel.
- **Natural Glows:** Secondary elements utilize "Golden Hour" glows (#F2C94C at low opacity) to simulate soft sunlight hitting a surface.
- **Categorical Accents:** Habit categories are differentiated by muted but vibrant "nature" tones: Sage for health, Blue for focus, and Purple for mindfulness. These should always be applied with a soft glow or subtle glassmorphic tint.

## Typography

This design system employs **Manrope** for its balanced, modern, and highly legible characteristics. It feels professional yet approachable. **Plus Jakarta Sans** is used for labels and utility text to add a touch of friendly elegance through its slightly more rounded letterforms.

To maintain the "introspective" vibe, avoid all-caps except for very small labels. Headlines should feel grounded and sturdy. On mobile devices, `headline-lg` should scale down to 28px to maintain visual harmony within the smaller viewport.

## Layout & Spacing

The layout philosophy follows a **fixed-width container system** on desktop to mimic a focused workspace, while transitioning to a **fluid grid** on mobile.

- **Desktop:** 12-column grid with a maximum content width of 1440px. Large margins (40px) create breathing room, emphasizing the "sanctuary" feel.
- **Mobile:** 4-column fluid grid with 16px side margins. 
- **Rhythm:** All spacing is based on a 4px baseline. Use 24px (lg) for vertical separation between distinct cards/sections and 16px (md) for internal component padding.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Subtle Glassmorphism**. Elements do not "float" with heavy drop shadows; instead, they appear to be placed on a surface with soft ambient light.

1.  **Base Layer:** Deep charcoal (#121416).
2.  **Surface Layer:** Semi-transparent dark green/grey with a 10px backdrop blur and a 1px inner border (white at 5% opacity).
3.  **Active Elements:** Elements "glow" from within. Instead of traditional shadows, use a `box-shadow` with a large blur radius (20px+) and a very low opacity color tint (e.g., #F2C94C at 0.08 alpha) to simulate light bounce.

## Shapes

The shape language is consistently **Rounded**, avoiding sharp corners to maintain a soft, welcoming atmosphere. Standard components utilize an 8px (0.5rem) radius. Large containers like cards or the isometric room viewing area should use 16px (1rem) or 24px (1.5rem) to feel more like architectural pieces than flat UI elements.

## Components

- **Buttons:** Primary buttons should use the Wood Accent color with dark text. Secondary buttons are glassmorphic (dark background, 1px border). All buttons have a high-tap area and use `rounded-lg`.
- **Cards:** Use a semi-transparent background with a subtle inner glow. Cards should feel like "shelves" or "boxes" within the room.
- **Habit Chips:** Small, pill-shaped tags using the categorical accent colors (Sage, Blue, Purple) at 15% opacity for the background and 100% for the text.
- **Progress Indicators:** Use soft, rounded bars with a "linear-gradient" that simulates a glowing tube or a filled wooden tray.
- **Input Fields:** Recessed into the surface. Use a slightly darker background than the card surface to create an "inset" physical feel.
- **Isometric Icons:** Where possible, icons should have a slight 3D perspective or shadow to complement the room aesthetic.