# Cross-Platform App Founder's Checklist

> **Purpose:** Everything a first-time (or experienced) app founder needs to consider
> beyond just building the app. This is the business/legal/ops layer that the
> playbook's technical phases don't cover.

---

## Things You Might Be Missing

### 1. Legal & Compliance (Before You Write ANY Code)

| Item | Status | Notes |
|------|--------|-------|
| **Business Entity** | 🔲 | LLC, Corp, or sole proprietor — needed for developer accounts |
| **Privacy Policy** | 🔲 | REQUIRED by both Apple and Google. Must be hosted at a public URL |
| **Terms of Service** | 🔲 | Strongly recommended, especially with user-generated content |
| **GDPR Compliance** | 🔲 | If you have ANY EU users: consent banners, data deletion, DPA |
| **CCPA Compliance** | 🔲 | If you have California users: "Do Not Sell My Data" option |
| **COPPA Compliance** | 🔲 | If your audience includes users under 13: parental consent |
| **HIPAA Compliance** | 🔲 | If handling health data: BAA with cloud providers, encryption |
| **App Tracking Transparency** | 🔲 | iOS 14.5+: ATT prompt required before tracking |
| **Cookie/Tracking Consent** | 🔲 | If using analytics that track users |
| **Google Play Data Safety** | 🔲 | Mandatory form disclosing what data is collected, shared, and encrypted |
| **Data Deletion URL** | 🔲 | Mandatory link for users to request account/data deletion (both App Store & Play Store) |
| **Open Source Licenses** | 🔲 | Audit all npm packages for license compatibility |
| **Trademark Search** | 🔲 | Search USPTO/EUIPO for app name conflicts BEFORE branding |
| **Domain Registration** | 🔲 | Register .com, .app, .io for your app name |

> **Skill to use:** `gdpr-data-handling` for GDPR implementation, `lex` for legal context

### 2. Developer Accounts (Set Up EARLY)

| Account | Cost | Setup Time | Notes |
|---------|------|------------|-------|
| **Apple Developer Program** | $99/year | 24-48 hours approval | Required for App Store + TestFlight |
| **Google Play Console** | $25 one-time | Usually instant | Required for Play Store. Personal accounts created after Nov 13, 2023 must closed-test with 20+ testers for 14+ days before submitting to production. |
| **D-U-N-S Number** | Free | 5-7 business days | Required if enrolling as organization (not individual) |
| **EAS (Expo Application Services)** | Free tier available | Instant | For cloud builds and OTA updates |
| **Sentry** (or crash reporting) | Free tier | Instant | Set up BEFORE launch, not after |

### 3. Monetization Gotchas Most Founders Miss

| Gotcha | Details |
|--------|---------|
| **Apple's 30% cut** | Apple takes 30% of all in-app digital purchases. 15% if you qualify for Small Business Program (<$1M/year) |
| **Google's 15% for first $1M** | Google takes 15% on first $1M, then 30% |
| **Apple's anti-steering rules** | You CANNOT tell users to subscribe on your website to avoid the 30% cut |
| **Physical goods exemption** | If selling physical goods/services, you CAN use Stripe/PayPal (food delivery, e-commerce) |
| **Subscription auto-renewal** | You MUST clearly disclose auto-renewal terms, price, and cancellation instructions |
| **Free trial requirements** | If offering free trials, you must clearly state when the trial ends and what happens after |
| **Restore Purchases** | Apple REQUIRES a "Restore Purchases" button — app will be rejected without it |
| **Receipt validation** | ALWAYS validate receipts server-side — client-side validation can be spoofed |
| **Tax implications** | App store revenue is taxable income. Set aside 25-30% for taxes |

### 4. App Store & Google Play Store Rejection Reasons (Most Common)

| Reason | Platform | How to Avoid |
|--------|----------|-------------|
| **Guideline 2.1 - Performance: App Completeness** | iOS | No placeholder content, no "coming soon" features, no broken links |
| **Guideline 2.3 - Performance: Accurate Metadata** | iOS | Screenshots must match actual app. No misleading descriptions |
| **Guideline 3.1.1 - Business: In-App Purchase** | iOS | Digital content/features MUST use Apple IAP (not Stripe/PayPal) |
| **Guideline 4.0 - Design: Minimum Functionality** | iOS | App must provide value beyond a simple website wrapper |
| **Guideline 5.1.1 - Legal: Data Collection** | iOS | Must have a privacy policy. Must declare all data collection in App Privacy |
| **Guideline 5.1.2 - Legal: Data Use** | iOS | Purpose strings must explain WHY you need each permission |
| **Missing demo account** | Both | If app requires login, provide a demo account in review notes |
| **Missing purpose strings** | iOS | Every iOS permission needs a human-readable reason string in Info.plist |
| **Play Policy: Spam & Minimum Functionality** | Android | App must launch, render correctly, and provide utility. Cannot be a webview wrapper of a site you do not own. |
| **Play Policy: Data Safety Form Mismatch** | Android | Automated scans detect if you transmit data (e.g. email, advertising ID, location) that you didn't declare. |
| **Play Policy: Sensitive Permissions** | Android | Rejections occur if you declare sensitive permissions (e.g., Background Location, All Files Access, SMS/Calls) without an approved declaration form. |
| **Android 13+ Notification Prompt** | Android | Notifications must be requested at runtime using the POST_NOTIFICATIONS permission prompt. |
| **20-Tester Closed Beta Failure** | Android | Personal developer accounts must have 20+ testers opted-in and active for 14+ days consecutively before applying for production access. |

### 5. Infrastructure & Services to Budget For

| Service | Free Tier | Paid Starts At | Need For |
|---------|-----------|---------------|----------|
| **Supabase** | 500MB DB, 1GB storage | $25/month | Backend, auth, database |
| **Firebase** | Spark plan generous | $0.01/doc read (Blaze) | Alternative backend |
| **Sentry** | 5K events/month | $26/month | Crash reporting |
| **RevenueCat** | $2.5K MTR | $0 up to $2.5K revenue | Subscription management |
| **Expo EAS** | 30 builds/month | $99/month (Priority) | Cloud builds, OTA updates |
| **Cloudflare** | Free tier excellent | $20/month (Pro) | CDN, DNS, DDoS protection |
| **Domain** | N/A | $10-15/year | App website, privacy policy hosting |
| **Postmark/Sendgrid** | 100 emails/month | $15/month | Transactional email |
| **Analytics** | Depends on provider | Varies | User behavior tracking |

### 6. Pre-Launch Marketing (Start in Phase 3)

| Action | When | Notes |
|--------|------|-------|
| **Landing page** | Phase 3 (when you have screenshots) | Email capture for early users |
| **Social media accounts** | Phase 1 (after naming) | Reserve @handles on all platforms |
| **App Store pre-order** | Phase 9 | Apple allows pre-order listings |
| **Press kit** | Phase 9 | App description, screenshots, logo, founder bio |
| **Beta testers** | Phase 8 | TestFlight (iOS) + Internal Testing (Android) |
| **Product Hunt submission** | Launch day | Great for initial traction |
| **App review sites** | 2 weeks before launch | AppAdvice, 148Apps, Appstorm |

### 7. Post-Launch Ops (Ongoing)

| Task | Frequency | Tool/Process |
|------|-----------|-------------|
| **Monitor crash reports** | Daily (first 2 weeks) | Sentry dashboard |
| **Respond to App Store reviews** | Within 24-48 hours | App Store Connect / Play Console |
| **Check analytics** | Daily (first month) | Analytics dashboard |
| **Update dependencies** | Monthly | npm audit + manual review |
| **iOS version support** | Annually | Drop support for oldest iOS version when new one launches |
| **Android API level** | Annually | Update targetSdkVersion per Google's requirements |
| **Privacy policy updates** | When data practices change | Update hosted privacy policy |
| **App Store metadata refresh** | Quarterly | A/B test screenshots, update descriptions for seasonal keywords |

### 8. Things That Can Kill Your App

| Risk | Mitigation |
|------|-----------|
| **No product-market fit** | Validate with 50+ users before building. Interview potential users. |
| **Building too many features** | MoSCoW prioritization. MVP = MINIMUM. Ship fast, iterate. |
| **Ignoring user feedback** | Read every review. Talk to users. Build what they actually need. |
| **Poor onboarding** | Users decide in 30 seconds. Show value immediately. |
| **No monetization strategy** | Define before building. Free apps with no plan die. |
| **Slow performance** | 53% of users uninstall apps that take >3 seconds to load. |
| **Ignoring platform guidelines** | Results in rejection, delays, and frustrated users. |
| **Not updating the app** | Signals abandonment. Update at least monthly for first 6 months. |
| **Security breach** | One data leak can destroy trust forever. Invest in security from day 1. |

### 9. Key Metrics to Track from Day 1

| Metric | Target | Why |
|--------|--------|-----|
| **D1 Retention** | >25% | How many users return the day after installing |
| **D7 Retention** | >12% | Weekly engagement health |
| **D30 Retention** | >5% | Long-term value indicator |
| **Onboarding Completion** | >70% | If lower, simplify onboarding |
| **Time to Value** | <60 seconds | How fast users see the core benefit |
| **Crash-Free Rate** | >99.5% | Stability threshold |
| **Free-to-Paid Conversion** | 2-5% | Subscription business benchmark |
| **Average Session Duration** | Varies by app type | Engagement indicator |
| **App Store Rating** | >4.5 stars | Below 4.0 kills organic installs |

### 10. Accessibility & Internationalization (Often Forgotten)

| Item | Why | Skill |
|------|-----|-------|
| **Screen reader support** | Required by law in some jurisdictions. Also 15%+ of users have some disability | `screen-reader-testing` |
| **Dynamic Type** (iOS) | Users who increase font size WILL see broken layouts if you don't support it | `hig-foundations` |
| **RTL language support** | Arabic, Hebrew users = broken layouts if not considered | `mobile-design` |
| **Localization** | 72% of consumers prefer content in their own language | ASO `app-store-optimization` |
| **Color blind support** | 8% of men are color blind. Don't rely solely on color to convey information | `wcag-audit-patterns` |

---

## Google Stitch — Specific Notes for Your Workflow

> This section clarifies exactly how Google Stitch fits into the playbook.

### What Stitch Does
- Stitch is an **AI UI generator** powered by Gemini 2.5 Flash
- It generates **high-fidelity HTML/CSS** from text prompts
- It exports **screenshots** (PNG) and **source code** (HTML)
- It supports **MOBILE device type** (390px width — iPhone 15 Pro)

### How Stitch Fits in Our Workflow

```
Phase 2: User Flows → Screen Inventory
            ↓
Phase 3: .stitch/DESIGN.md (visual style) + .stitch/SITE.md (screen list)
            ↓
Phase 3: Stitch generates HTML/CSS + screenshots for EVERY screen
            ↓
Phase 5: Convert Stitch HTML/CSS → React Native components
            ↓
Phase 7: Polish to match Stitch screenshots exactly
```

### What Stitch Does NOT Do
- It does NOT generate React Native code directly — you get HTML/CSS
- It does NOT handle state management, API integration, or business logic
- It does NOT replace a design system — you need `DESIGN_SYSTEM.md` + `.stitch/DESIGN.md`
- It does NOT guarantee pixel-perfect mobile rendering — you need to adjust

### Stitch MCP Server Tools Available

| Tool | Purpose |
|------|---------|
| `create_project` | Create a new Stitch project |
| `get_project` | Get project metadata and screen IDs |
| `list_projects` | List all your Stitch projects |
| `generate_screen_from_text` | Generate a screen from a text prompt |
| `get_screen` | Get a specific screen's metadata and download URLs |
| `list_screens` | List all screens in a project |

### Critical Stitch Best Practices
1. **Always include `.stitch/DESIGN.md`** content in every generation prompt
2. **Set `deviceType: MOBILE`** for all screen generations
3. **Save metadata.json** after every screen generation (screen IDs persist across sessions)
4. **Download screenshots at full resolution** by appending `=w{width}` to the URL
5. **Generate one screen at a time** — review before moving to the next
6. **Use specific, detailed prompts** — "Create a dashboard" ❌ → See `stitch-ui-design` skill ✅

---

## Complete Phase Execution Summary

| Phase | Input Required | Output Produced | Gate |
|-------|---------------|-----------------|------|
| 0 | Nothing | Scaffold + working memory | User approves playbook |
| 1 | App concept answers | PRD + competitive analysis + brand | User approves PRD |
| 2 | Approved PRD | Personas + flows + onboarding + platform rules | User approves UX |
| 3 | Approved UX | Design system + Stitch screens + app icon | User approves designs |
| 4 | Approved designs | Architecture + DB + API + deployed backend | User approves architecture |
| 5 | Working backend | All screens coded with live data | All screens rendering |
| 6 | Working app | Payment integration tested in sandbox | Sandbox payments working |
| 7 | Working app with payments | Polished UX with animations, a11y, dark mode | Visual fidelity audit passes |
| 8 | Polished app | All tests passing, zero P0/P1 bugs | Test suite green |
| 9 | Tested app | App submitted to both stores | Builds uploaded to stores |
| 10 | Live app | Analytics + monitoring + V2 roadmap | Ongoing |
