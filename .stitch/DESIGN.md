# Design System: Sadhana
**Project ID:** [TBD_PROJECT_ID]

## 1. Visual Theme & Atmosphere
The design atmosphere of Sadhana is **Editorial Organic** combined with **Premium Tactile Warmth**. It feels like a high-end yoga journal or sanctuary, using grounding earthy hues and plenty of whitespace. The layout is airy, spacious, and extremely restrained. Elements are separated by subtle hair-thin borders rather than heavy colored cards. Shadows are flat or whisper-soft, keeping the interface clean and focused.

## 2. Color Palette & Roles
*   **Cream Background (#FDFEFE):** The dominant canvas color, giving the application a warm, organic background rather than a stark white.
*   **Charcoal Slate Text (#2C3E50):** The primary color for all copy, headings, and icon outlines, providing high-contrast editorial clarity.
*   **Muted Blue-Gray (#5D6D7E):** The secondary color for labels, subheadings, non-active icon buttons, and borders.
*   **Terracotta Accent (#D35400):** The primary brand accent, used for core action buttons, progress bars, active icons, and streak flames.
*   **Olive Green Accent (#1E8449):** The secondary accent, representing growth and rewards, used for success banners, unlocked states, and calendar progress nodes.
*   **Charcoal Surface (#1A252C):** Base background for dark mode equivalents (cream text and terracotta accents persist).

## 3. Typography Rules
*   **Headings & Sanskrit Terms:** Use **Lora Bold** (`font-family: 'Lora', serif; font-weight: 700; color: #2C3E50`). This serif typography adds a traditional, authentic, and grounding voice.
*   **Body Text & Inputs:** Use **Raleway Regular/Medium** (`font-family: 'Raleway', sans-serif; color: #2C3E50`). A highly legible, modern sans-serif with a clean structure.
*   **Buttons:** Set in uppercase or bold Raleway with letter-spacing for premium legibility.

## 4. Component Stylings
*   **Buttons:** Curved, pill-shaped edges (`rounded-full`). Height should be at least `48px` (touch target accessibility). Primary buttons use a solid terracotta background with cream text. Secondary buttons are cream/transparent with a thin charcoal border.
*   **Cards/Containers:** Subtly rounded corners (`rounded-xl` / `12px` border-radius). They should use a flat background (#FFFFFF on light cream) with a very thin slate border (`border-slate-200`) and a whisper-soft diffused drop shadow (`shadow-sm`).
*   **Inputs/Forms:** Squared-off or subtly rounded edges (`rounded-lg` / `8px` border-radius). Background should be white (#FFFFFF), height `52px`, with a clear 1px outline that shifts to terracotta upon activation.

## 5. Layout Principles
*   **Whitespace:** Generous padding and wide gutters. Screens must feel calm and uncluttered.
*   **Rhythm:** Left-aligned headers, structured lists, and clean grid layouts. 
*   **Symmetry:** Balanced margins of `24px` on both sides of screens. Tabs are clean and spaced out.
