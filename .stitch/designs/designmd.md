# Design System: Sadhana
**Project ID:** [TBD_PROJECT_ID]

## 1. Visual Theme & Atmosphere
The visual identity of Sadhana is **Earth Ritual** (Tactile Grounding & Editorial Restraint). The aesthetic mirrors a high-end yoga journal or printed scripture, prioritizing generous white space and hair-thin border lines over complex shadows or heavy fills. Every viewport features a thin decorative, cropped SVG arc in the top-right corner called the **Mandala thread**.

## 2. Color Palette & Roles
*   **Warm Bone Background (#FDFAF5):** The base canvas color for all screen layouts. It feels organic, warm, and natural.
*   **Charcoal warm text (#1C1409):** The primary color for all copy, headings, and icon strokes.
*   **Warm Umber (#6B5A41):** Used for sub-labels, captions, details, inactive icons, and helper descriptions.
*   **Terracotta Accent (#C44B22):** The primary brand accent, used for active buttons, select indicator outlines, streak flames, and active icons.
*   **Ashoka Green (#1A6B3A):** Used for unlocks, milestones, and success checkmarks.
*   **Sandstone Highlight (#F5E6C8):** Used as a warm background tint for selected cards, tags, and progress highlights.
*   **Destructive Red (#991F1F):** Used for critical confirmation warnings and deletions.
*   **Surface White (#FFFFFF):** Background color for cards and bottom sheets. Separated by `1px solid rgba(42,29,10,0.08)`.

## 3. Typography Rules
*   **Display Headings:** **Cormorant Garamond Serif** (`font-family: 'Cormorant Garamond', serif; font-weight: 600; letter-spacing: -0.02em`). Used for screen titles, headings, and course names.
*   **Body / UI Text:** **DM Sans Sans-Serif** (`font-family: 'DM Sans', sans-serif; font-weight: 400;`). Used for descriptions, labels, button texts, and settings.
*   **Sanskrit Overlays:** **Noto Serif Devanagari** (`font-family: 'Noto Serif Devanagari', serif; font-weight: 500`) — *used only inside Sanskrit glossary sheet overlays.*

## 4. Component Stylings
*   **Buttons:** Curved, pill-shaped edges (`rounded-full`). Height should be at least `48px` (touch target accessibility). Primary buttons use a solid terracotta background (`#C44B22`) with white text. Secondary buttons are outlined in terracotta or umber.
*   **Cards/Containers:** Subtly rounded corners (`rounded-xl` / `12px` border-radius). They should use a flat background (#FFFFFF) with a very thin border (`1px solid rgba(42,29,10,0.08)`) and no shadows (editorial look).
*   **Inputs/Forms:** Squared-off or subtly rounded edges (`rounded-lg` / `8px` border-radius). Background should be white (#FFFFFF), height `52px`, with a clear 1px outline that shifts to terracotta upon activation.

## 5. Layout Principles
*   **Margins:** Consistent horizontal margin of `24px` on both sides.
*   **Whitespace:** Spacious padding and wide gutters. Screens must feel calm and uncluttered.
*   **Mandala Thread:** Cropped, 0.5px stroke terracotta arc in the top-right corner of every screen.