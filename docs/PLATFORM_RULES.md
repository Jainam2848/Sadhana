# Platform Design Rules — Sadhana

> **Phase:** 2 (UX Research & Information Architecture)
> **Skills Applied:** `mobile-design`, `ui-ux-pro-max`, `hig-foundations`, `hig-patterns`
> **Last Updated:** 2026-06-15
> **Status:** Completed

---

## 1. Introduction

As a premium, cross-platform mobile application built on **React Native + Expo**, **Sadhana** enforces platform-specific visual and interactive design rules. We do not port iOS designs directly to Android, nor do we compromise platform-native conventions. 

Our engineering model follows the **Platform Unification vs. Divergence Matrix**:

```
UNIFY (Cross-Platform Shared)          DIVERGE (Platform-Specific Native)
─────────────────────────────          ──────────────────────────────────
Core Business & App Logic              Navigation Transitions & Stacks
Data Models & Schemas                  Interactive Gestures (Back swipes)
API Contracts & JSON Payloads          Iconography Sets (SF vs Material)
Form Validations                       Typography Scales (SF Pro vs Roboto)
State Management (Zustand)             Pickers, Sheets, & Dialogs
Sadhana Rewards Calculations           Haptic Patterns (CoreHaptics vs Android)
```

---

## 2. iOS Rules (Apple HIG Guidelines)

All iOS layouts, interactions, and components must align with the **Apple Human Interface Guidelines (HIG)**:

### 2.1 Navigation Patterns
*   **Root Container:** System Bottom Tab Bar (`TabView` / `createBottomTabNavigator`). Displays exactly 4 tabs (Home, Library, Rewards, Profile). Tabs must display an icon and text label (never hide labels).
*   **Stack Navigation:** Standard push and pop page transitions (`createNativeStackNavigator`).
*   **Gestures:** Must support the **native edge-swipe gesture** from the left border to navigate back. Never block this swipe gesture with horizontal swipers (e.g. scrollviews must be inset to avoid edge conflicts).
*   **Modality:** Use sheets for modal tasks (like Routine Config or Settings). On iOS 15+, use sheet presentation controllers with card-like styling that can be dragged down to dismiss.
*   **Transitions:** Fade animations for crossfading audio/video screens. Slide-from-bottom for modals.

### 2.2 Safe Areas & Layout Limits
*   **Safe Area Insets:** Margins must respect `SafeAreaView` boundaries. Never overlay interactive buttons under the home indicator (bottom swipe line) or the Dynamic Island / status bar area.
*   **Layout Spacing:** Minimum margins of 16pt on outer borders. Inner spacings aligned to an 8pt grid system.

### 2.3 Typography & Hierarchy
*   **System Fonts:** 
    *   *Headings:* New York (Serif) — conveys the calm, authentic, Ashramesque brand personality.
    *   *Body:* SF Pro (Sans-Serif) — system optimized for maximum readability.
*   **Dynamic Type Support:** The layout must scale dynamically to support iOS System Font Sizes. Use relative units (`em`/`rem` mapped via Tailwind NativeWind) instead of absolute pixel bounds.

### 2.4 Interactive Elements & Button Styles
*   **Minimum Touch Targets:** All buttons, toggle switches, and links must have a minimum touch target size of **44 x 44 points**.
*   **Standard iOS Taps:** Buttons should have subtle opacity feedback (`TouchableOpacity` set to `activeOpacity={0.7}`) rather than scale transforms.

### 2.5 Haptic Feedback (Core Haptics / UIFeedbackGenerator)
Use the native haptic feedback triggers via `Expo Haptics` (`UIFeedbackGenerator` equivalents):
*   **Medium Impact:** Tapping a primary routine card or starting a session (`Haptics.ImpactFeedbackStyle.Medium`).
*   **Light Impact:** Tapping tab options, toggling Sanskrit definitions (`Haptics.ImpactFeedbackStyle.Light`).
*   **Success Notification:** Completing a routine, subscribing, or claiming a reward (`Haptics.NotificationFeedbackType.Success`).
*   **Error Notification:** Payment failure, validation error on password inputs (`Haptics.NotificationFeedbackType.Error`).

### 2.6 Dark Mode & Materials
*   **System Backgrounds:** Backgrounds must use semantic materials that adjust dynamically (e.g., `systemBackground`, `secondarySystemBackground`).
*   **Vibrancy & Translucency:** Use blurred glass overlays (`BlurView` in Expo) for player control cards and tab backgrounds, supporting the premium look.

---

## 3. Android Rules (Material 3 Guidelines)

All Android layouts, typography, and interactive responses must conform to the **Android Material 3 (M3)** specifications:

### 3.1 Navigation Patterns
*   **Root Container:** Material 3 Navigation Bar (Bottom Navigation) with active pill indicators behind icons.
*   **System Back Gesture/Button:** Android users rely heavily on the physical or gesture-based **System Back Navigation**. The app must handle back events safely. Tapping the back button on the Home Dashboard must minimize the app (default OS behavior), whereas tapping back on inner stack screens pops the view.
*   **Dialogs & Sheets:** Android uses standard Material bottom sheets or centered alert dialogs with square-ish corners. No rounded iOS-style sheet cards.

### 3.2 Safe Areas & Edge-to-Edge Display
*   **Edge-to-Edge Layout:** Configure the app to render content behind the status bar and navigation bar. Status bar text color must adjust dynamically (dark icons on light background; light icons on dark background).
*   **System Navigation Bar:** Navigation bar background must be set to transparent or match the app's bottom background, ensuring the home gesture bar sits cleanly over our layout.

### 3.3 Typography & Hierarchy
*   **System Fonts:**
    *   *Headings:* Roboto Serif or custom serif.
    *   *Body:* Roboto.
*   **Text Scaling:** Android's Accessibility Suite allows users to scale font sizes up to 200%. Layout containers must be tested to ensure text wrap does not clip labels or break buttons.

### 3.4 Interactive Elements & Buttons
*   **Minimum Touch Targets:** Material 3 demands a minimum touch target of **48 x 48 dp** to support users with motor limitations.
*   **Material Ink Ripple:** All clickable elements (buttons, library cards, list rows) must show the native **Ink Ripple effect** (`TouchableNativeFeedback` with ripple background). Avoid plain opacity fades.
*   **FAB (Floating Action Button):** If a primary action is needed (like starting a custom breathwork session), place a standard Material FAB in the bottom right corner of the Library Browser.

### 3.5 Haptic Feedback
Android's haptic engine is structured differently than iOS. Ensure `Expo Haptics` maps to appropriate vibrations:
*   **Taps:** Short, crisp vibrations (`Vibration.vibrate(10)` or standard `Impact` triggers).
*   **Bounces:** Longer pulses for success states.

### 3.6 Dynamic Color (Material You)
*   **Integration:** On Android 12+, respect system dynamic color palettes when enabled by the user. M3 components should draw subtle accents (e.g., card backgrounds, selection indicators) from the user's system wallpaper theme, maintaining a cohesive OS aesthetic while protecting our core Earth Premium brand colors (Terracotta and Olive).

---

## 4. Platform Differences Cheat-Sheet

| Interaction Element | iOS (Apple HIG) | Android (Material 3) |
|:---|:---|:---|
| **Primary System Font** | SF Pro / New York (Serif) | Roboto / Roboto Serif |
| **Minimum Touch Target**| 44 x 44 pt | 48 x 48 dp |
| **Back Button Navigation**| Left edge-swipe gesture; navigation bar back button | System back gesture (left/right edge) or physical back button |
| **Click Feedback** | Opacity fade (70%) | Ink Ripple effect |
| **Tabs Layout** | Flat icons with text labels | Active pill background highlights behind icons |
| **Modality Dismissal** | Drag down cards / swipe to dismiss sheets | Tap overlay backdrop / system back action |
| **Primary Haptic Call** | `UIFeedbackGenerator` (Medium/Light/Success) | Haptic Feedback Constants (`Vibration.vibrate`) |
