# Design System — Sadhana

> **Phase:** 3 (Design System & UI Generation)
> **Aesthetic Theme:** Earth Ritual
> **Status:** Approved
> **Last Updated:** 2026-06-15

---

## 1. Visual Theme & Atmosphere

The **Sadhana** visual experience is built around the concept of **Earth Ritual**. It combines the warm, grounding textures of traditional Indian heritage with the clean, structured layout of modern heritage publishing. It feels authentic, intentional, and highly premium.

### Design Principles:
1.  **Tactile Grounding:** Uses the warm bone background (`#FDFAF5`) and sandstone accents (`#F5E6C8`) to evoke a physical yoga space.
2.  **Editorial Restraint:** Employs thin, hairline borders (`1px solid rgba(42,29,10,0.08)`) and negative space instead of heavy color card fills or complex gradients.
3.  **Classical Typography:** Serif headings (`Cormorant Garamond`) honor classical heritage, while functional UI labels use a modern sans-serif (`DM Sans`).
4.  **Quiet Micro-Interactions:** Uses a strict three-tier motion hierarchy to preserve user focus and maintain a meditative atmosphere.

---

## 2. Color Palette & Roles

Every component in Sadhana inherits these visual identity tokens:

| Token Name | Hex Code / Value | Functional Role |
| :--- | :--- | :--- |
| **Background** | `#FDFAF5` | Warm bone base canvas background |
| **Surface** | `#FFFFFF` | Cards, bottom sheets, and modal bases |
| **Surface Border** | `1px solid rgba(42,29,10,0.08)` | Subtle card dividers and containment borders |
| **Primary Text** | `#1C1409` | Near-black warm: headings, body copy, and navigation titles |
| **Secondary Text** | `#6B5A41` | Warm umber: captions, subheadings, labels |
| **Accent — Terracotta** | `#C44B22` | Darker terracotta: Core CTA buttons, active states, progress indicators |
| **Growth — Ashoka Green**| `#1A6B3A` | Dark forest green: Success tags, streak calendar nodes, unlocks |
| **Warm Highlight** | `#F5E6C8` | Sandstone: Active selections, highlighted tags, focus backgrounds |
| **Danger / Destructive** | `#991F1F` | Deep red: Account deletion warning borders, destructive CTAs |
| **Disabled Text** | `rgba(28,20,9,0.32)` | Outlined or secondary text on inactive buttons/inputs |
| **Disabled Surface** | `rgba(42,29,10,0.04)` | Surface background color for inactive buttons/fields |
| **Validation Error** | `#C0392B` | Medium crimson red: Input field validation error borders and labels |

---

## 3. Typography Scale

*   **Display Headings:** `Cormorant Garamond` (serif, weight 600, letter-spacing -0.02em).
*   **Body & UI Copy:** `DM Sans` (sans-serif, weight 400/500).
*   **Sanskrit Terms:** `Noto Serif Devanagari` (Devanagari font-family, weight 500) — *restricted to Sanskrit tooltip overlays only.*

### Typography Hierarchy

| Style Role | Font | Size (px) | Weight | Letter Spacing | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | Cormorant Garamond | `32px` | `600` | `-0.02em` | `1.1` |
| **Heading** | Cormorant Garamond | `24px` | `600` | `-0.01em` | `1.2` |
| **Subheading** | Cormorant Garamond | `18px` | `600` | `0` | `1.3` |
| **Body Large** | DM Sans | `15px` | `400/500` | `0` | `1.5` |
| **Caption/Details** | DM Sans | `13px` | `400` | `0` | `1.4` |
| **Micro Label** | DM Sans | `11px` | `500` | `0.08em` | `1.2` |

*Note: In production components, these scale dynamically with system font-size accessibility standards.*

---

## 4. Spacing, Layout & Shadows

Sadhana uses a **4px-base spacing grid** and safe-area-aware layouts:

*   **Mobile Canvas Size:** `390px` width (standard iPhone 15 Pro viewport).
*   **Touch Targets:** Minimum height of `48px` on all interactive buttons and tap items.
*   **Border Radius Scale:**
    *   `8px`: Chips, small tags, and badges.
    *   `12px`: Dashboard cards and course grid tiles.
    *   `20px`: Modal bottom sheets and slide-up dialogs.
    *   `28px`: Primary CTA buttons.
*   **Tab Bar:** Sticky bottom navigation, `56px` height, 5 tabs.
*   **Elevation & Depth Shadows**:
    *   `Flat/Flat-Card`: `1px solid rgba(42,29,10,0.08)` border (no shadow).
    *   `Elevation Low (Dashboard Card)`: `box-shadow: 0 4px 12px rgba(42,29,10,0.04)`.
    *   `Elevation High (Modal/Bottom Sheet)`: `box-shadow: 0 -8px 24px rgba(28,20,9,0.08)`.

---

## 5. Compositional Standards

### 5.1 Empty States
Any screen containing zero-states (e.g. no completed sessions in history, empty course lists) must render:
*   Min padding: `48px` vertical.
*   An SVG line icon centered, sized `48px`, stroke `#6B5A41` at `1.2px` width.
*   Label: `DM Sans 15px / 500 / #1C1409`, center-aligned.
*   Description: `DM Sans 13px / 400 / #6B5A41`, center-aligned.

### 5.2 Icon System
*   **Sizing Bounds**: `20px` for inline/header elements, `24px` for navigation tabs, `32px` for highlighted features.
*   **Stroke Parameters**: Hard limit of `1.5px` stroke weight for active states, `1.2px` for normal states. No solid fill unless checking/selecting.

---

## 6. Motion Hierarchy (Four Tiers)

To prevent visual clutter, motion is strictly structured into four categories:

1.  **Tier 1 — Screen Transitions (280ms ease-out):** Screen pushes, modal entries (slide-up translation from `translateY(100%)` to `0`).
2.  **Tier 2 — Component Feedback (150ms ease-out):** Button presses (scale `0.97`), card taps, category chip selections, toggle slides.
3.  **Tier 3 — Ambient / Atmospheric (2000ms–4000ms ease-in-out infinite):** Used selectively for the streak flame glow and breathing visualizers. *Must be disabled under `prefers-reduced-motion: reduce` settings.*
4.  **Tier 4 — Ultra-Slow Ornamental Loops (16000ms+ linear infinite):** Used for slow ambient background rotations (like the single player's rotating mandala artwork). *Must be disabled under `prefers-reduced-motion` settings.*

---

## 7. Signature Visual Element: The Mandala Thread

Every screen must include exactly one instance of the **Mandala thread**:
*   An extremely thin SVG circular arc (`stroke-width: 0.5px`, `opacity: 0.08`, color: `#C44B22`).
*   Positioned at the top-right corner of the screen background, partially cropped by the viewport edge.
*   It is strictly decorative and never interactive.
