# Signature Design Language Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a signature design language for Sadhana combining ancient Indian temple geometry, sandstone/bronze/gold hues, and lotus-petal curves with modern Apple-inspired minimalism.

**Architecture:** Extend global CSS theme variables and Javascript context for dynamic color transitions, implement custom lotus-petal border classes, create an ornamental temple-carved Divider component, refine the background MandalaThread SVG, and integrate custom Indian line-icons.

**Tech Stack:** React Native, Expo 54, NativeWind v5 / Tailwind v4, React Native Reanimated v4.

---

### Task 1: Extend Tailwind v4 styling with new signature colors and lotus-petal corner utilities

**Files:**
- Modify: [global.css](file:///d:/Desktop/Fitness/src/global.css)

**Step 1: Define CSS Variables and Theme Mapping**
Open [global.css](file:///d:/Desktop/Fitness/src/global.css) and add the new colors to the `:root` and `.dark` variables:
```css
/* In :root */
--sandstone-rose: #EADEC9;
--temple-bronze: #8A663E;
--temple-bronze-light: #D4B895;
--manuscript-gold: #D4AF37;

/* In .dark */
--sandstone-rose: #2C2621;
--temple-bronze: #C5A880;
--temple-bronze-light: #A37E58;
--manuscript-gold: #FFDF7A;
```
Then under `@theme`, register them:
```css
--color-sandstone-rose: var(--sandstone-rose);
--color-temple-bronze: var(--temple-bronze);
--color-temple-bronze-light: var(--temple-bronze-light);
--color-manuscript-gold: var(--manuscript-gold);
```
Add the custom organic lotus-petal corner utility classes under a custom CSS layer:
```css
@utility rounded-lotus {
  border-top-left-radius: 28px;
  border-bottom-right-radius: 28px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

@utility rounded-lotus-inverse {
  border-top-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 28px;
  border-bottom-left-radius: 28px;
}
```

**Step 2: Run verification**
Verify the styles compile cleanly with Expo's build checker.
Run: `npm run typecheck`
Expected: Command exits successfully with no output errors.

**Step 3: Commit**
```bash
git add src/global.css
git commit -m "design: add sandstone, bronze, gold colors and lotus radius utilities"
```

---

### Task 2: Extend Javascript Theme Context with Signature Colors

**Files:**
- Modify: [ThemeProvider.tsx](file:///d:/Desktop/Fitness/src/providers/ThemeProvider.tsx)

**Step 1: Update Types and Color Palettes**
Modify the types in `ThemeProvider.tsx` to include the new signature colors:
```typescript
export interface ThemeColors {
  // Existing colors...
  sandstoneRose: string;
  templeBronze: string;
  templeBronzeLight: string;
  manuscriptGold: string;
}
```
Update the respective time-of-day palettes (`morningColors`, `middayColors`, `eveningColors`):
```typescript
const morningColors: ThemeColors = {
  // Existing...
  sandstoneRose: '#E8DEC9',
  templeBronze: '#9E7850',
  templeBronzeLight: '#E5CDAE',
  manuscriptGold: '#D4AF37',
};

const middayColors: ThemeColors = {
  // Existing...
  sandstoneRose: '#EADEC9',
  templeBronze: '#8A663E',
  templeBronzeLight: '#D4B895',
  manuscriptGold: '#D4AF37',
};

const eveningColors: ThemeColors = {
  // Existing...
  sandstoneRose: '#2C2621',
  templeBronze: '#C5A880',
  templeBronzeLight: '#A37E58',
  manuscriptGold: '#FFDF7A',
};
```

**Step 2: Update Shared and Derived Colors**
Ensure the Reanimated shared values interpolate these new colors smoothly. Update `AnimatedColors` interface and the derived color configurations.
Update:
```typescript
export interface AnimatedColors {
  // Existing...
  sandstoneRose: SharedValue<string>;
  templeBronze: SharedValue<string>;
  templeBronzeLight: SharedValue<string>;
  manuscriptGold: SharedValue<string>;
}
```
Inside the `ThemeProvider` component, initialize these values and add them to the animated transitions object.

**Step 3: Verify TypeScript compiles**
Run: `npm run typecheck`
Expected: Command exits successfully.

**Step 4: Commit**
```bash
git add src/providers/ThemeProvider.tsx
git commit -m "design: integrate signature colors into ThemeProvider context"
```

---

### Task 3: Create the Carved Divider Component

**Files:**
- Create: [Divider.tsx](file:///d:/Desktop/Fitness/src/components/ui/Divider.tsx)

**Step 1: Write Divider Component**
Create a new file `src/components/ui/Divider.tsx` with a refined, carved aesthetic that renders a thin centerline with a tiny diamond motif in the middle, inspired by temple friezes.
```tsx
import React from 'react';
import { View } from '@/tw';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';

export interface DividerProps {
  variant?: 'solid' | 'carved';
  className?: string;
}

export function Divider({ variant = 'solid', className = '' }: DividerProps) {
  const { colors } = useTheme();

  if (variant === 'carved') {
    return (
      <View className={`flex-row items-center justify-center py-2 ${className}`}>
        <View className="flex-1 h-[0.5px] bg-surface-border/50" />
        <View className="mx-3 opacity-60">
          <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <Path
              d="M6 0 L12 6 L6 12 L0 6 Z"
              fill={colors.accent}
              opacity={0.7}
            />
            <Path
              d="M6 3 L9 6 L6 9 L3 6 Z"
              fill="none"
              stroke={colors.background}
              strokeWidth={1}
            />
          </Svg>
        </View>
        <View className="flex-1 h-[0.5px] bg-surface-border/50" />
      </View>
    );
  }

  return <View className={`h-[1px] bg-surface-border/40 ${className}`} />;
}
```

**Step 2: Verify Compiles**
Run: `npm run typecheck`
Expected: Passes.

**Step 3: Commit**
```bash
git add src/components/ui/Divider.tsx
git commit -m "feat: implement carved temple-inspired Divider component"
```

---

### Task 4: Add Asymmetric Lotus Corner Support to Cards

**Files:**
- Modify: [Card.tsx](file:///d:/Desktop/Fitness/src/components/ui/Card.tsx)

**Step 1: Refactor Card.tsx**
Add a `variant` prop to card to support standard `rounded-2xl` vs. organic `lotus` and `lotus-inverse` geometries:
```tsx
import React from 'react';
import { View } from '@/tw';

export type CardVariant = 'standard' | 'lotus' | 'lotus-inverse';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}

export function Card({ children, className = '', variant = 'standard' }: CardProps) {
  let radiusClass = 'rounded-2xl';
  if (variant === 'lotus') {
    radiusClass = 'rounded-lotus';
  } else if (variant === 'lotus-inverse') {
    radiusClass = 'rounded-lotus-inverse';
  }

  return (
    <View className={`bg-surface/80 border border-surface-border/50 p-6 ${radiusClass} ${className}`}>
      {children}
    </View>
  );
}
```

**Step 2: Verify Compiles**
Run: `npm run typecheck`
Expected: Passes.

**Step 3: Commit**
```bash
git add src/components/ui/Card.tsx
git commit -m "design: add lotus organic corner support to Cards"
```

---

### Task 5: Refine the background MandalaThread SVG with detailed geometry

**Files:**
- Modify: [MandalaThread.tsx](file:///d:/Desktop/Fitness/src/components/ui/MandalaThread.tsx)

**Step 1: Enhance MandalaThread SVG**
Update `src/components/ui/MandalaThread.tsx` to render beautiful, subtle geometric petals and star vertices on the inner rings rather than simple circles, mimicking authentic mandala grids with ultra-thin line weight.
Add thin leaf-petal and dashed concentric sub-circles:
```tsx
// Inside MandalaThread.tsx SVG block, add:
// 1. A rotated diamond pattern representing the inner sanctuary structure
// 2. Petal shapes or geometric guides
```
Ensure stroke width remains strictly thin (`0.5px` to `0.8px`) and opacity is extremely low (`0.03` to `0.08`) to preserve Apple-inspired minimalism.

**Step 2: Verify Compiles**
Run: `npm run typecheck`
Expected: Passes.

**Step 3: Commit**
```bash
git add src/components/ui/MandalaThread.tsx
git commit -m "design: upgrade MandalaThread with high-craft geometric mandala petals"
```

---

### Task 6: Add Indian Motif Icons to PracticeIcon library

**Files:**
- Modify: [PracticeIcon.tsx](file:///d:/Desktop/Fitness/src/components/ui/PracticeIcon.tsx)

**Step 1: Define New Icon Variants**
Open `src/components/ui/PracticeIcon.tsx` and add `lotus`, `temple-dome`, and `manuscript` to `PracticeIconType`:
```typescript
export type PracticeIconType = 'asana' | 'pranayama' | 'dhyana' | 'diya' | 'om-coin' | 'lotus' | 'temple-dome' | 'manuscript';
```
Write the SVG paths for these three icons using the clean `commonProps` stroke styles.
- **Lotus**: A simple symmetrical petal outline.
- **Temple Dome**: A minimal double-arch structure with a center point.
- **Manuscript**: A clean linear paper scroll.

**Step 2: Verify Compiles**
Run: `npm run typecheck`
Expected: Passes.

**Step 3: Commit**
```bash
git add src/components/ui/PracticeIcon.tsx
git commit -m "design: add lotus, temple-dome, and manuscript to PracticeIcon types"
```

---

### Task 7: Apply the visual identity changes to the Home dashboard

**Files:**
- Modify: [home.tsx](file:///d:/Desktop/Fitness/app/(tabs)/home.tsx)

**Step 1: Apply Lotus Cards, Custom Dividers and Motif Accents**
Update `home.tsx` to utilize the new components and themes.
- Replace standard cards with the organic `variant="lotus"` Cards in high-visibility sections like the daily recommended routine.
- Add `<Divider variant="carved" />` between recent sessions instead of standard thin lines.
- Apply subtle `text-manuscript-gold` or `text-temple-bronze` styling highlights to title badges and secondary descriptors.

**Step 2: Verify Compiles**
Run: `npm run typecheck`
Expected: Passes.

**Step 3: Commit**
```bash
git add app/\(tabs\)/home.tsx
git commit -m "design: apply new Indian-minimalist styling accents to Home dashboard"
```

---

### Verification Plan

#### Automated Tests
- Run TS checks to ensure no typescript violations:
  `npm run typecheck`

#### Manual Verification
- Deploy local dev server (`npx expo start`) and verify visual correctness on the device:
  1. Inspect the Home screen cards for organic "lotus petal" corner-radii.
  2. Inspect the custom Divider between elements to see the centerline and center-aligned carved diamond ornament.
  3. Verify color blending when switching theme settings or time-of-day simulation.
  4. Inspect the updated background MandalaThread arc for geometric complexity.
