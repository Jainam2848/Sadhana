# User Flows & Screen Inventory — Sadhana

> **Phase:** 2 (UX Research & Information Architecture)
> **Skills Applied:** `ui-ux-pro-max`, `mobile-design`, `onboarding-psychologist`, `marketing-psychology`
> **Last Updated:** 2026-06-15
> **Status:** Completed

---

## 1. User Journey Flows (Mermaid Diagrams)

These user flows trace key journeys through the **Sadhana** mobile experience. They specify decision nodes, loading states, and platform-specific behaviors (such as iOS haptics or Android system back gestures).

### Flow A: First-Time User Onboarding & Paywall Gating
This journey shows the progression from initial install to the core "value moment" (completing the first short Sadhana routine). It handles the onboarding personalization questionnaire, the interactive breathing space demo, GDPR checks, notification priming, the soft-gated paywall, and routes users dynamically. Account creation is required only if starting a trial or purchase; otherwise, users bypass registration to try the free tier immediately as guests.

```mermaid
flowchart TD
    Start([App Installed & Opened]) --> Welcome[1. Welcome Screen\nEarth Ritual Visuals]
    Welcome --> Personalize[2. Personalization Questionnaire\nGoals, Experience & Habit Anchor]
    Personalize --> OnboardingDemo[3. Onboarding Demo / Breathing Space\n30s concentric circles, glossary, haptic]
    OnboardingDemo --> GDPRCheck{User in EU?}
    
    GDPRCheck -- Yes --> GDPRPrompt[4. GDPR Consent Screen\nAnalytics Toggles] --> NotifyPrime
    GDPRCheck -- No --> NotifyPrime
    
    NotifyPrime[5. Permission Priming Screen\nFramed with chosen Habit Anchor] --> NotifyOS{User Accepts?}
    
    NotifyOS -- Tap Yes --> NativeNotify[Trigger Native OS Notification Prompt] --> OnboardingPaywall
    NotifyOS -- Tap Skip --> OnboardingPaywall
    
    OnboardingPaywall[6. Onboarding Paywall Screen\nSubscription / 7-Day Trial] --> PaywallChoice{User Subscribes?}
    
    PaywallChoice -- Yes --> AuthPrompt[7. Auth / Register Screen\nRequire signup to secure trial/purchase] --> Subscribe[Process Purchase & Set premium = true] --> DashboardPremium[8. Home Dashboard\nPersonalized Daily Sadhana Active]
    PaywallChoice -- No / Skip --> SetFree[Set premium = false\nDeferred Guest Session] --> DashboardFree[8. Home Dashboard\nLocked Custom Plan, Static Global Daily Sadhana]
    
    DashboardPremium --> PlayCustom[Play Personalized Routine\nAsana + Pranayama + Dhyana custom plan] --> ValueMoment
    DashboardFree --> PlayGlobal[Play Static Global Routine\nFixed 12-Min Short Practice] --> ValueMoment
    
    ValueMoment([Value Moment:\nCompleted First Sadhana & Feel Calm])

    classDef default fill:#FDFEFE,stroke:#2C3E50,stroke-width:1px;
    classDef action fill:#D35400,stroke:#2C3E50,stroke-width:2px,color:#FDFEFE;
    classDef decision fill:#ECFDF5,stroke:#1E8449,stroke-width:2px,color:#064E3B;
    class Welcome,Personalize,OnboardingDemo,GDPRPrompt,NotifyPrime,OnboardingPaywall,AuthPrompt,DashboardPremium,DashboardFree,PlayCustom,PlayGlobal default;
    class Start,ValueMoment,Subscribe,SetFree action;
    class GDPRCheck,NotifyOS,PaywallChoice decision;
```


---

### Flow B: Primary Action Flow (Daily Sadhana Routine)
This represents the daily active loop: opening the dashboard, playing the integrated physical, breathing, and meditative routines, and processing the reward triggers based on subscription status.

```mermaid
flowchart TD
    Start([App Opened to Home Tab]) --> CheckStreak[Animate Daily Streak Counter\n🔥 Greet user: 'Hari Om']
    CheckStreak --> TodaySadhana[Today's Sadhana Card Displayed\nPostures + Breath + Silence]
    TodaySadhana --> TapSadhana[Tap Card] --> ConfigScreen[Routine Player Config:\nDuration, Off-line cached status]
    
    ConfigScreen --> TapStart[Tap Start Practice\nTrigger iOS/Android Medium Haptic] --> PlayAsana[Active Player: Asana (Video)\nFlowing stretches, 60fps transitions]
    
    PlayAsana --> AutoTransition1[Auto-Transition:\nFade video to static art] --> PlayPranayama[Active Player: Pranayama (Audio)\nSoothing voice, Sanskrit translation toggle]
    
    PlayPranayama --> AutoTransition2[Auto-Transition:\nAmbient visualizer active] --> PlayDhyana[Active Player: Dhyana (Meditation)\nSilent timer, soft background sitar]
    
    PlayDhyana --> CompleteSession[Routine Completed!\nTrigger db write: session logs]
    
    CompleteSession --> UserTier{User Tier?}
    
    UserTier -- Free Tier --> FetchAd[Request Interstitial Ad] --> DisplayAd[Render Full-Screen Ad\nStart 10s Countdown Timer]
    DisplayAd --> TimerCheck{Timer = 0?}
    TimerCheck -- No --> WaitTimer[Disable & Hide Close Button] --> TimerCheck
    TimerCheck -- Yes --> EnableClose[Show Close/Skip Button] --> TapClose[User Taps Close] --> DismissAd[Dismiss Ad & Call Server Callback] --> Confetti
    
    UserTier -- Premium Tier --> AddCoins[Add 30 Karma Coins to Wallet\nLocal State + Secure Db Write] --> Confetti
    
    Confetti[Confetti Animation Screen:\nShow Updated Stats & Streaks] --> BackHome([Back to Dashboard])

    classDef default fill:#FDFEFE,stroke:#2C3E50,stroke-width:1px;
    classDef action fill:#D35400,stroke:#2C3E50,stroke-width:2px,color:#FDFEFE;
    classDef decision fill:#ECFDF5,stroke:#1E8449,stroke-width:2px,color:#064E3B;
    class CheckStreak,TodaySadhana,ConfigScreen,PlayAsana,PlayPranayama,PlayDhyana,CompleteSession,WaitTimer,EnableClose,DismissAd,Confetti default;
    class Start,TapSadhana,TapStart,TapClose,BackHome action;
    class UserTier,TimerCheck decision;
```

---

### Flow C: Purchase & Upgrade Flow
The journey a free user takes when encountering locked premium content, launching the paywall, completing local App Store/Google Play billing, and updating application permissions.

```mermaid
flowchart TD
    Start([User encounters premium content\nor taps Upgrade banner]) --> Paywall[Paywall Screen Loaded:\nLora typography, clear benefit comparison]
    Paywall --> TogglePlan[Select Plan:\nMonthly vs Annual]
    TogglePlan --> TapSubscribe[Tap 'Subscribe Now'\nTrigger Local Billing API] --> AppStoreAuth[Invoke Native OS Purchase Dialogue\nApp Store FaceID / Play Store Passcode]
    
    AppStoreAuth --> PurchaseResult{Transaction Success?}
    
    PurchaseResult -- Yes --> VerifyReceipt[Call Server Receipt Verification API] --> UpdateState[Update User Schema: premium = true\nSave subscription key in SecureStore]
    UpdateState --> PlayHaptic[Trigger Success Haptic Bounces] --> WelcomeModal[Display 'Welcome to Premium' Overlay] --> DismissModal([Access Gated Premium Content])
    
    PurchaseResult -- No/Cancel --> FailHandler[Display error notification:\n'Transaction not completed'] --> RetryOption{Retry?}
    RetryOption -- Yes --> Paywall
    RetryOption -- No --> DismissPaywall([Return to previous screen])

    classDef default fill:#FDFEFE,stroke:#2C3E50,stroke-width:1px;
    classDef action fill:#D35400,stroke:#2C3E50,stroke-width:2px,color:#FDFEFE;
    classDef decision fill:#ECFDF5,stroke:#1E8449,stroke-width:2px,color:#064E3B;
    class Paywall,TogglePlan,AppStoreAuth,VerifyReceipt,UpdateState,WelcomeModal,FailHandler default;
    class Start,TapSubscribe,PlayHaptic,DismissModal,DismissPaywall action;
    class PurchaseResult,RetryOption decision;
```

---

### Flow D: Return User Flow
Traces how a returning user re-enters the application—either directly or via a daily push reminder—checks session validity, and loads their dynamic dashboard.

```mermaid
flowchart TD
    StartDirect([User taps App Icon]) --> LoadApp
    StartPush([User taps daily push notification]) --> DeepLink[Parse Daily Deep Link] --> LoadApp
    
    LoadApp[Splash Screen Rendered\nEarth Premium logo, loading indicator] --> CheckLocalToken{Valid Token in SecureStore?}
    
    CheckLocalToken -- Yes --> LoadLocalState[Initialize Zustand Client State] --> FetchData[Fetch updated daily streak & Today's Sadhana]
    FetchData --> LoadHome[Home Screen Loaded:\nStreak animation starts, greet user] --> Action([Taps 'Start Today's Sadhana'])
    
    CheckLocalToken -- No/Expired --> ClearSession[Clear local expired tokens] --> NavigateOnboarding[Navigate to Onboarding Welcome Slide] --> ActionOnboard([Proceed with signup/login])

    classDef default fill:#FDFEFE,stroke:#2C3E50,stroke-width:1px;
    classDef action fill:#D35400,stroke:#2C3E50,stroke-width:2px,color:#FDFEFE;
    classDef decision fill:#ECFDF5,stroke:#1E8449,stroke-width:2px,color:#064E3B;
    class LoadApp,LoadLocalState,FetchData,LoadHome,ClearSession,NavigateOnboarding default;
    class StartDirect,StartPush,Action,ActionOnboard action;
    class CheckLocalToken decision;
```

---

### Flow E: Settings & Account Management
Allows the user to manage settings, adjust accessibility typography scales, edit GDPR settings, or confirm permanent account deletion.

```mermaid
flowchart TD
    Start([User opens settings from Profile Tab]) --> SettingsDashboard[Settings Menu:\nAccount, Preferences, Privacy, Billing]
    
    SettingsDashboard --> SelectAccount[Tap Account Details] --> EditAccount[Edit Username / Password] --> SaveAccount[Call Server Update API\nShow success toast] --> SettingsDashboard
    
    SettingsDashboard --> SelectPreferences[Tap Preferences] --> TypographySlider[Adjust Font Size Scale\nElena's dynamic text scale] --> SavePreferences[Save in local configuration state\nUpdate font scaling layout] --> SettingsDashboard
    
    SettingsDashboard --> SelectPrivacy[Tap GDPR & Privacy] --> GDPRPreferences[Toggle optional analytical tracking\nRequest data export / Delete Account]
    
    GDPRPreferences -- Taps Delete Account --> ConfirmDelete[Delete Account Warning Screen\nAlert: All data will be permanently lost] --> ConfirmTaps{Confirm deletion?}
    
    ConfirmTaps -- Yes --> ExecuteDelete[Call Server Delete API\nTruncate user profile, logs, and tokens] --> ClearSecureStore[Clear all local Keychain/Keystore data] --> NavigateRegister([Navigate to register slide])
    
    ConfirmTaps -- No/Cancel --> SettingsDashboard

    classDef default fill:#FDFEFE,stroke:#2C3E50,stroke-width:1px;
    classDef action fill:#D35400,stroke:#2C3E50,stroke-width:2px,color:#FDFEFE;
    classDef decision fill:#ECFDF5,stroke:#1E8449,stroke-width:2px,color:#064E3B;
    class SettingsDashboard,SelectAccount,EditAccount,SaveAccount,SelectPreferences,TypographySlider,SavePreferences,SelectPrivacy,GDPRPreferences,ConfirmDelete,ClearSecureStore default;
    class Start,ExecuteDelete,NavigateRegister action;
    class ConfirmTaps decision;
```

---

## 2. Screen Inventory

This is a numbered inventory of every screen in the **Sadhana** MVP. It specifies each screen's purpose, navigation parent, and core interactive components.

### Navigation Section A: Onboarding Stack (Modal Flow)
1.  **Welcome Screen**
    *   *Purpose:* Introduce brand tagline ("Your Daily Mind-Body Sanctuary") and visual tone.
    *   *Parent:* None (Root on first open).
    *   *Key Components:* Swipeable card slideshow, Terracotta logo icon, "Get Started" call-to-action button, "I already have an account" login text link.
2.  **Personalization Screen**
    *   *Purpose:* Gather user preferences to construct the dynamic daily schedule.
    *   *Parent:* Welcome Screen.
    *   *Key Components:* Progress bar, multi-select question buttons (Focus: stress, sleep, mobility), skill level selectors (Beginner, Intermediate, Advanced), "Continue" button.
3.  **GDPR Consent Screen**
    *   *Purpose:* Secure legal tracking and data collection consent for EU users.
    *   *Parent:* Personalization Screen.
    *   *Key Components:* Descriptive legal copy (large, clear Lora font), "Agree to All" primary button, "Manage Options" secondary button.
4.  **Permission Priming Screen**
    *   *Purpose:* Contextualize *why* system notification alerts benefit the user's daily habits before calling native prompts.
    *   *Parent:* GDPR Consent Screen.
    *   *Key Components:* Visual mock calendar graphic displaying a streak of flame icons, "Allow Reminders" button, "Skip" text link.
5.  **Authentication & Register Screen**
    *   *Purpose:* Create a user account or sign in.
    *   *Parent:* Permission Priming Screen.
    *   *Key Components:* Email text input field, password input field (with toggle visibility icon), "Create Account" primary button, "Skip for Now (Guest)" text link.

### Navigation Section B: Home Tab Stack (Primary Tab)
6.  **Sadhana Dashboard (Home Screen)**
    *   *Purpose:* The central hub displaying daily streak status, quick routine access, and notifications.
    *   *Parent:* Root Tab Controller.
    *   *Key Components:* Animated Streak Flame counter (🔥), Today's Sadhana Card (displays customized Personalized Plan for Premium; displays locked custom plan badge and routes to static "Global Daily Sadhana" for Free), "Recent Sessions" horizontal list, dynamic greeting text ("Hari Om, [Name]").
7.  **Routine Config Screen**
    *   *Purpose:* Preview and configure the selected Sadhana routine before starting.
    *   *Parent:* Sadhana Dashboard.
    *   *Key Components:* Summary of the routine (dynamic personalized segments for Premium; fixed global segments for Free), total duration indicator, offline cache toggle switch (Premium only), "Start Sadhana" primary CTA button.
8.  **Active Routine Player Screen**
    *   *Purpose:* A clean, high-performance media player that plays physical sequences and guides breathing/meditation.
    *   *Parent:* Routine Config Screen.
    *   *Key Components:* High-definition video player (active for Asana), static art display (active for Pranayama/Dhyana), ambient audio player visualizer, play/pause controls, seek slider, Sanskrit word tooltips, full-screen orientation toggle.
9.  **Session Completed Screen**
    *   *Purpose:* Congratulate user, present stats, and trigger reward milestones or ad placement.
    *   *Parent:* Active Routine Player Screen.
    *   *Key Components:* In-app confetti particles, session statistics (minutes completed, daily streak count), "Claim Rewards" button, Full-screen ad interstitial container (conditional for Free tier with countdown and close buttons).

### Navigation Section C: Library Tab Stack (Discovery Tab)
10. **Library Browser Screen**
    *   *Purpose:* Explore single yoga practices, meditations, breathwork, and philosophy guides.
    *   *Parent:* Root Tab Controller.
    *   *Key Components:* Category filter chips (Asana, Pranayama, Dhyana, Philosophy), search bar, horizontal scrolling featured carousels, vertical grid of course listing cards.
11. **Course Detail Screen**
    *   *Purpose:* Review course outline, lessons list, and enroll.
    *   *Parent:* Library Browser Screen.
    *   *Key Components:* Prominent course header image, instructor bio panel, course description text, vertical list of lessons (unlocked/locked icons), "Enroll / Play Lesson 1" button.

### Navigation Section D: Rewards Tab Stack (Incentives Tab)
12. **Rewards Dashboard Screen**
    *   *Purpose:* Track ad-milestones, wallet balances, and active unlocking options.
    *   *Parent:* Root Tab Controller.
    *   *Key Components:* Monthly ad-view progress bar (0 to 50 milestones), "Karma Coins" balance card (Premium only), "Watch Rewarded Ad" CTA button, unlock choices grid.
13. **Karma Coins Redemption Screen**
    *   *Purpose:* Allow Premium users to exchange points for subscription discounts or donations.
    *   *Parent:* Rewards Dashboard Screen.
    *   *Key Components:* Balance summary, redemption option list (e.g., "$5 off renewal" card, "Indian Script Preservation Donation" button), Confirmation dialog overlay.

### Navigation Section E: Profile & Settings Stack (Settings Tab)
14. **Profile Dashboard Screen**
    *   *Purpose:* Display user identity, progress graphs, and calendar heatmaps.
    *   *Parent:* Root Tab Controller.
    *   *Key Components:* User profile photo and name card, calendar streak heatmap, total time stats panel, Settings gear icon (navigates to settings stack).
15. **Settings Screen**
    *   *Purpose:* The central portal for editing details and preferences.
    *   *Parent:* Profile Dashboard Screen.
    *   *Key Components:* Vertical list of setting buttons (Account Details, App Preferences, GDPR & Privacy, Help & Support).
16. **Preferences Screen**
    *   *Purpose:* Configure styling and accessibility scaling.
    *   *Parent:* Settings Screen.
    *   *Key Components:* Accessibility font size slider, language selection picker, push notification reminder time picker.
17. **GDPR & Privacy Screen**
    *   *Purpose:* Manage data safety and privacy.
    *   *Parent:* Settings Screen.
    *   *Key Components:* Optional analytical tracking toggle, "Export Account Data" button, "Delete Account" button (navigates to confirmation).
18. **Account Deletion Confirmation Screen**
    *   *Purpose:* Verify permanent account deletion.
    *   *Key Components:* Account Details, Preferences, GDPR & Privacy settings items list.
19. **Preferences Screen**
    *   *Purpose:* Set user preferences and accessibility features.
    *   *Parent:* Settings Screen.
    *   *Key Components:* Text sizing slider, reminder time picker, evening reminder switch.
20. **GDPR & Privacy Screen**
    *   *Purpose:* Manage tracking toggles and export/deletion prompts.
    *   *Parent:* Settings Screen.
    *   *Key Components:* Analytics consent toggles, "Request Data Export" button, "Delete Account" button.
21. **Account Deletion Confirmation Screen**
    *   *Purpose:* Strict deletion verification modal.
    *   *Parent:* GDPR & Privacy Screen.
    *   *Key Components:* Red warning banner, "DELETE" confirmation text input, "Permanently Delete" CTA.

---

## 3. Navigation Map (Mermaid Diagram)

This map shows the layout of Sadhana's screens, tracking tab transitions, modal stacks, and routing options.

```mermaid
  graph TD
    %% Root Controller
    Root[Root App Controller] --> OnboardingStack{Has Account?}
    
    %% Onboarding Modal Stack
    OnboardingStack -- No --> Welcome[1. Welcome Screen]
    Welcome --> Personalize[2. Personalization Screen]
    Personalize --> Demo[3. Onboarding Demo / Breathing Space]
    Demo --> GDPR[4. GDPR Consent Screen]
    GDPR --> Priming[5. Permission Priming Screen]
    Priming --> Paywall[6. Onboarding Paywall Screen]
    
    Paywall --> |Subscribe / Trial| Auth[7. Auth & Register Screen]
    Paywall --> |Skip / Free| GuestRoute[Initialize Guest Session]
    
    Auth --> MainTabs[Bottom Tab Navigator]
    GuestRoute --> MainTabs
    
    %% Root Tab Controller
    OnboardingStack -- Yes --> MainTabs
    
    MainTabs --> TabHome[Tab 1: Home Stack]
    MainTabs --> TabLibrary[Tab 2: Library Stack]
    MainTabs --> TabRewards[Tab 3: Rewards Stack]
    MainTabs --> TabProfile[Tab 4: Profile Stack]
    
    %% Home Tab Stack
    TabHome --> Dashboard[8. Sadhana Dashboard]
    Dashboard --> Config[9. Routine Config Screen]
    Config --> Player[10. Active Routine Player]
    Player --> Completed[11. Session Completed Screen]
    Completed --> Dashboard
    
    %% Library Tab Stack
    TabLibrary --> Browser[12. Library Browser]
    Browser --> Detail[13. Course Detail Screen]
    Detail --> PlayerSingle[14. Single Media Player Screen]
    
    %% Rewards Tab Stack
    TabRewards --> RewardsDash[15. Rewards Dashboard]
    RewardsDash --> Redemptions[16. Karma Coin Redemption]
    
    %% Profile Tab Stack
    TabProfile --> Profile[17. Profile Screen]
    Profile -.-> |Upgrade Link| Paywall
    Profile --> Settings[18. Settings Screen]
    
    %% Settings Stack
    Settings --> Prefs[19. Preferences Screen]
    Settings --> Privacy[20. GDPR & Privacy Screen]
    Privacy --> Deletion[21. Account Deletion Screen]
    Deletion --> |Confirm API Success| Welcome
    
    %% Gated triggers
    Detail -.-> |Locked Session| Paywall
    Browser -.-> |Locked Session| Paywall

    classDef default fill:#FDFEFE,stroke:#2C3E50,stroke-width:1px;
    classDef tab fill:#ECFDF5,stroke:#1E8449,stroke-width:2px,color:#064E3B;
    classDef modal fill:#FDF5E6,stroke:#D35400,stroke-width:1px;
    class Welcome,Personalize,Demo,GDPR,Priming,Auth,Paywall,Deletion modal;
    class Dashboard,Browser,RewardsDash,Profile default;
    class TabHome,TabLibrary,TabRewards,TabProfile tab;
```
