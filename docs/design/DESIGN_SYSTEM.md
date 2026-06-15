# Design System — Sadhana

> **Phase:** 3 (Design System & UI Generation)
> **Aesthetic Theme:** Editorial Organic (*Earth Premium*)
> **Status:** Approved
> **Last Updated:** 2026-06-15

---

## 1. Visual Theme & Atmosphere

The **Sadhana** visual experience is built around the concept of **Editorial Organic (Earth Premium)**. It combines the warm, grounding textures of traditional Indian heritage with the crisp, clean containment of modern publishing. It feels authentic, intentional, and premium.

### Design Principles:
1.  **Tactile Grounding:** Use organic tones (terracotta, cream, olive) to evoke a physical yoga space.
2.  **Structural Restraint:** Lean heavily on negative space (asymmetry, wide margins) and editorial borders instead of heavy color fills.
3.  **Classical Typography:** Sanskrit text and primary headings are set in an elegant serif to honor heritage, while settings and forms use a clean, modern sans-serif.
4.  **Quiet Micro-Interactions:** Subtle, fluid entrance fades and haptic feedback reinforce a calm mental state. Avoid flashing colors, bouncy motions, or decorative animations.

---

## 2. Color Palette & Roles

Sadhana employs CSS variables representing the *Earth Premium* palette. All components must reference these semantic tokens.

### 2.1 Color Tokens

| Token Name | Light Hex | Dark Hex | Functional Role |
| :--- | :--- | :--- | :--- |
| `--color-bg` | `#FDFEFE` | `#1A252C` | Base screen background (Cream / Slate Charcoal) |
| `--color-text-primary` | `#2C3E50` | `#FDFEFE` | Primary titles, body copy, and heavy typography |
| `--color-text-secondary` | `#5D6D7E` | `#95A5A6` | Captions, secondary info, labels, and borders |
| `--color-primary` | `#D35400` | `#E67E22` | Terracotta: Core CTA, focus rings, and active states |
| `--color-secondary` | `#1E8449` | `#2ECC71` | Olive Green: Success, streaks, and unlocked progress |
| `--color-surface` | `#FFFFFF` | `#24333C` | Cards, buttons, and bottom-sheet containers |
| `--color-surface-hover` | `#ECFDF5` | `#1E3F35` | Interactive hover/tapped states for list items |
| `--color-error` | `#C0392B` | `#E74C3C` | Destructive alerts, delete buttons, and validation errors |
| `--color-gold` | `#F39C12` | `#F1C40F` | VIP/Premium highlights, Best Value paywall indicators |

---

## 3. Typography Scale

*   **Expressive Serif:** `Lora` (font-family: `'Lora', serif`). Evocative, grounding, traditional.
*   **Restrained Sans-Serif:** `Raleway` (font-family: `'Raleway', sans-serif`). Accessible, clean, modern.

### Typography Hierarchy

| Style Role | Font | Size (px) | Weight | Letter Spacing | Line Height |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | Lora | `32px` | `700` | `-0.02em` | `1.2` |
| **Header 1** | Lora | `26px` | `600` | `-0.01em` | `1.3` |
| **Header 2** | Lora | `20px` | `600` | `0` | `1.4` |
| **Body Large** | Raleway | `16px` | `500` | `0` | `1.5` |
| **Body Regular** | Raleway | `14px` | `400` | `0` | `1.5` |
| **Caption/Label** | Raleway | `12px` | `600` | `0.05em` | `1.4` |
| **Button Text** | Raleway | `15px` | `700` | `0.02em` | `1` |

*Note: In code implementations, these must scale dynamically according to system-level accessibility settings (iOS Dynamic Type / Android Font Scaling).*

---

## 4. Spacing & Geometry

Sadhana follows a strict **4px-base grid** for consistent spatial rhythms.

### 4.1 Spacing Scale
*   `space-xs` (4px): Inner elements, tight label spacing.
*   `space-sm` (8px): Card internal padding, button gaps.
*   `space-md` (12px): Form spacing, component gaps.
*   `space-lg` (16px): Standard mobile screen margins (sides).
*   `space-xl` (24px): Prominent vertical section spacing.
*   `space-2xl` (32px): Hero section gaps, outer borders.

### 4.2 Border Radius
*   `radius-sm` (8px): Form input fields, small badges, and tags.
*   `radius-md` (12px): Dashboard cards, navigation elements.
*   `radius-lg` (16px): Hero panels, bottom sheets, and modals.
*   `radius-pill` (9999px): Primary buttons, streak icons, and pill badges.

### 4.3 Depth & Elevation (Shadows)
*   `shadow-none` (0): Base style for editorial, flat interfaces.
*   `shadow-subtle` (Light: `0 4px 12px rgba(44,62,80,0.04)` / Dark: `none`): Default card depth.
*   `shadow-prominent` (Light: `0 8px 24px rgba(44,62,80,0.08)` / Dark: `none`): Paywall containers and modals.

---

## 5. Component Specifications

### 5.1 Primary CTA Button
*   **Shape:** Height `48px`, `radius-pill`, center-aligned text.
*   **Default State:** Background `--color-primary` (Terracotta), text `--color-bg` (Cream).
*   **Tapped/Hover State:** Shift opacity to `0.9` (haptic vibration triggered).
*   **Disabled State:** Background `--color-text-secondary` with `0.4` opacity, white text.

### 5.2 Card Containers
*   **Shape:** `radius-md`, border `1px solid rgba(93,109,126,0.15)`.
*   **Color:** Background `--color-surface`, text `--color-text-primary`.
*   **Interactivity:** Hover triggers background transition to `--color-surface-hover` and border color shift to `--color-secondary` (Olive).

### 5.3 Text Inputs
*   **Shape:** Height `52px`, `radius-sm`, padding-horizontal `space-lg`.
*   **Border:** `1px solid var(--color-text-secondary)`.
*   **Focus State:** Border `2px solid var(--color-primary)` (Terracotta), text `--color-text-primary`.
*   **Error State:** Border `2px solid var(--color-error)` (Crimson), text error label displays at `12px` below.

### 5.4 Tooltips & Bottom Sheets
*   **Overlay Style:** Semi-transparent background mask (`rgba(44,62,80,0.4)`).
*   **Bottom Sheet:** Slide-up panel from screen bottom. Rounded top corners (`radius-lg`), padding `24px`. Background `--color-bg`, heading in Lora (Serif), definitions in Raleway (Sans-Serif).

---

## 6. Haptic Feedback Patterns

*   **Success (Routine Finish, Streak Unlocked):** Double light pulse (iOS `UINotificationFeedbackTypeSuccess` / Android `HapticFeedbackConstants.CONFIRM`).
*   **Selection Change (Tapping cards/tabs):** Single light tap (iOS `UISelectionFeedbackGenerator` / Android `HapticFeedbackConstants.KEYBOARD_TAP`).
*   **Error (Failed transaction, form validation):** Triple rapid warning pulse (iOS `UINotificationFeedbackTypeError` / Android `HapticFeedbackConstants.REJECT`).
