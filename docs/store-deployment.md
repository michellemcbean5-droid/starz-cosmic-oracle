# Starz Cosmic Oracle — Store Deployment Guide

## Prerequisites

1. **EAS CLI**: `npm install -g eas-cli`
2. **Expo Account**: Create at https://expo.dev
3. **Apple Developer Account**: For iOS builds ($99/year)
4. **Google Play Console**: For Android builds ($25 one-time)

## Environment Setup

```bash
# Login to EAS
eas login

# Configure project
eas build:configure
```

## Build Profiles

| Profile | Command | Purpose |
|---------|---------|---------|
| Development | `eas build --profile development` | Local testing with dev client |
| Preview | `eas build --profile preview` | Internal distribution / QA |
| Production | `eas build --profile production` | App Store / Play Store |

## iOS App Store Submission

### Step 1: Build Production IPA
```bash
eas build --platform ios --profile production
```

### Step 2: App Store Connect Setup
1. Go to https://appstoreconnect.apple.com
2. Create new app: **Starz Cosmic Oracle**
3. Bundle ID: `com.starz.cosmicoracle`
4. Primary Category: Lifestyle / Entertainment
5. Secondary Category: Health & Fitness

### Step 3: Store Listing
- **App Name**: Starz Cosmic Oracle
- **Subtitle**: Your AI-Powered Cosmic Guide
- **Description**: 
  ```
  Discover your cosmic path with Starz Cosmic Oracle — the most complete astrology app powered by AI.

  ✨ Daily AI-Enhanced Horoscopes for all 12 zodiac signs
  🌌 Full Birth Chart (Natal Chart) with Big Three analysis
  🔮 Interactive Tarot Readings with AI interpretations
  🌙 Moon Phase Tracker with lunar calendar
  🪐 Real-Time Planetary Transits & Retrograde alerts
  💕 Zodiac Compatibility Analysis with AI insights
  🌙 Dream Interpretation powered by AI
  🔢 Numerology & Life Path Number calculator

  Why Starz Cosmic Oracle?
  • AI-powered insights you won't find anywhere else
  • Beautiful cosmic dark theme with stunning animations
  • Accurate astronomical calculations
  • Share readings with friends
  • Daily push notifications for cosmic events

  Free Features:
  • 3 daily readings (horoscope, tarot, moon)
  • Basic horoscope readings
  • Moon phase tracking

  Premium ($9.99/month):
  • Unlimited readings
  • AI-enhanced horoscopes
  • Full tarot with AI interpretation
  • Ad-free experience

  Pro ($29.99/month):
  • Everything in Premium
  • Full birth chart analysis
  • Planetary transits
  • Dream interpretation
  • Compatibility analysis

  Elite ($99.99/month):
  • Everything in Pro
  • Numerology insights
  • Data export
  • 1-on-1 astrologer access
  • Exclusive cosmic events

  Download now and let the stars guide you! ✨
  ```
- **Keywords**: astrology, horoscope, zodiac, tarot, moon phases, birth chart, numerology, dream interpretation, compatibility, cosmic, daily horoscope, star sign, natal chart, planetary transits

### Step 4: Screenshots
Required: 5 screenshots per device size (iPhone 6.5", iPhone 5.5", iPad 12.9")
- Home screen with horoscope
- Tarot card flip animation
- Birth chart result
- Moon phase calendar
- Compatibility analysis

### Step 5: In-App Purchases
1. In App Store Connect → Features → In-App Purchases
2. Add products:
   - `com.starz.cosmicoracle.premium_monthly` — Consumable/Auto-renewable
   - `com.starz.cosmicoracle.pro_monthly` — Auto-renewable subscription
   - `com.starz.cosmicoracle.elite_monthly` — Auto-renewable subscription
3. Set pricing tiers
4. Add review notes explaining subscription model

### Step 6: Submit for Review
- App Review Information:
  - Demo account: Not needed (free tier works)
  - Notes: "Free astrology app with optional premium subscriptions. All core features work without payment."
- Typical review time: 24-48 hours

---

## Android Google Play Submission

### Step 1: Build Production AAB
```bash
eas build --platform android --profile production
```

### Step 2: Google Play Console Setup
1. Go to https://play.google.com/console
2. Create new app: **Starz Cosmic Oracle**
3. Package name: `com.starz.cosmicoracle`
4. Category: Lifestyle / Entertainment

### Step 3: Store Listing
- **Title**: Starz Cosmic Oracle
- **Short Description**: Your AI-powered cosmic guide — horoscope, tarot, birth chart & more
- **Full Description**: Same as iOS description above
- **Keywords**: astrology, horoscope, zodiac, tarot, moon phases, birth chart, numerology, dream interpretation, compatibility

### Step 4: Screenshots
Required: 8 screenshots (phone), 8 (tablet 7"), 8 (tablet 10")
- Same screens as iOS

### Step 5: Feature Graphic
- 1024×500px banner with app branding

### Step 6: In-App Products
1. Google Play Console → Monetize → Products
2. Add subscriptions:
   - `com.starz.cosmicoracle.premium_monthly` — Monthly subscription
   - `com.starz.cosmicoracle.pro_monthly` — Monthly subscription
   - `com.starz.cosmicoracle.elite_monthly` — Monthly subscription
3. Set pricing by region
4. Configure free trial (7 days for Premium)

### Step 7: Content Rating
- Category: Reference / Lifestyle
- Content rating: PEGI 3 / ESRB Everyone
- No violence, no sexual content, no user-generated content

### Step 8: Release
1. Internal testing → Closed testing → Open testing → Production
2. Upload AAB to release
3. Roll out to 10% → 50% → 100%

---

## Fastlane Setup (Optional)

### Install Fastlane
```bash
cd ios && fastlane init
cd ../android && fastlane init
```

### Fastfile (iOS)
```ruby
platform :ios do
  desc "Deploy to App Store"
  lane :release do
    build_app(scheme: "StarzCosmicOracle")
    upload_to_app_store(
      skip_metadata: false,
      skip_screenshots: false,
      submit_for_review: true
    )
  end
end
```

### Fastfile (Android)
```ruby
platform :android do
  desc "Deploy to Google Play"
  lane :release do
    gradle(task: "bundleRelease")
    upload_to_play_store(
      track: 'production',
      release_status: 'draft'
    )
  end
end
```

---

## Privacy Policy

Required for both stores. See `docs/privacy-policy.md` for template.

Key points:
- No personal data sold to third parties
- Birth data stored locally on device
- Optional account creation
- Data deletion available in Profile
- AI processing via HuggingFace (no data retention)
- Analytics: RevenueCat (purchase data only)

---

## Terms of Service

Required for both stores. See `docs/terms-of-service.md` for template.

Key points:
- Astrology readings for entertainment purposes
- Not a substitute for professional advice
- Subscription auto-renewal terms
- Refund policy (standard Apple/Google)
- User-generated content (dreams) belongs to user

---

## CI/CD Automation

GitHub Actions workflow in `.github/workflows/eas-build.yml`:
- Triggers on push to `main`
- Runs tests, lint, typecheck
- Builds preview for Android + iOS
- For production: manually trigger with `workflow_dispatch`

Required secrets:
- `EXPO_TOKEN` — EAS authentication
- `GITHUB_TOKEN` — Already provided

---

## Post-Launch Checklist

- [ ] Monitor crash reports (Firebase Crashlytics)
- [ ] Track IAP revenue (RevenueCat dashboard)
- [ ] Respond to user reviews (1-2 days)
- [ ] A/B test subscription pricing
- [ ] Update screenshots with new features
- [ ] Seasonal content (retrograde alerts, eclipse notifications)
- [ ] Press outreach with master codes for reviewers
- [ ] Influencer partnerships with promo codes
- [ ] ASO optimization (update keywords monthly)
- [ ] Feature requests tracking

## Support Contacts

- **Technical**: GitHub Issues
- **Billing**: RevenueCat Dashboard / App Store / Google Play
- **Press**: Use master code for review access
- **Feature Requests**: In-app feedback or GitHub

---

*Last updated July 2025*
