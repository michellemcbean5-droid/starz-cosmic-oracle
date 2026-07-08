# Starz Cosmic Oracle 🌟

A beautiful, fully-featured astrology and cosmic guidance mobile app built with React Native and Expo.

## Features

- ✨ **Daily Horoscope** — AI-enhanced personalized readings for all 12 zodiac signs
- 🌌 **Birth Chart (Natal Chart)** — Calculate your Big Three and planetary positions
- 🔮 **Tarot Reading** — Draw cards with flip animations and AI-enhanced interpretations
- 🌙 **Moon Phase Tracker** — Accurate lunar calendar with illumination data
- 🪐 **Planetary Transits** — Current cosmic weather with retrograde tracking
- 💕 **Compatibility Analysis** — Zodiac compatibility with AI-powered insights
- 🌙 **Dream Oracle** — AI dream interpretation with sentiment analysis
- 🔢 **Numerology** — Life path numbers and cosmic number meanings
- 📜 **Reading History** — Save and revisit past readings
- 💎 **Premium Subscriptions** — Free, Premium ($9.99/mo), Pro ($29.99/mo), Elite ($99.99/mo)
- 🔔 **Push Notifications** — Daily horoscope and moon event reminders
- 📤 **Share** — Share readings with friends
- 🤖 **AI Integration** — Free HuggingFace API for enhanced cosmic insights

## Tech Stack

- **Framework**: React Native 0.76.9 + Expo SDK 52
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State**: Zustand
- **Styling**: StyleSheet + Expo LinearGradient + Expo Blur
- **Animation**: React Native Reanimated
- **Storage**: AsyncStorage
- **Payments**: react-native-iap + RevenueCat (ready)
- **Ads**: react-native-google-mobile-ads (ready)
- **Testing**: Jest + jest-expo
- **AI**: HuggingFace Inference API (free tier)

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

### Installation

```bash
# Clone the repo
git clone https://github.com/michellemcbean5-droid/starz-cosmic-oracle.git
cd starz-cosmic-oracle

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

```bash
# iOS simulator
npm run ios

# Android emulator
npm run android
```

### Environment Variables

Create `.env` from `.env.example`:
```bash
cp .env.example .env
```

Fill in your actual API keys (never commit `.env`):
- `HF_API_TOKEN` — HuggingFace API token (optional, free tier)
- `MASTER_ACCESS_CODE` — Master code for Elite tier access

## Project Structure

```
starz-cosmic-oracle/
├── src/
│   ├── api/              # Astrology data layer, AI integration, calculations
│   ├── components/       # Reusable UI components (CosmicCard, Starfield, etc.)
│   ├── constants/        # Colors, typography, astrology data, monetization
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Root & Tab navigators
│   ├── screens/          # 11 feature screens
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Astro calculations, theme, storage, notifications
│   └── App.tsx           # Entry point with ErrorBoundary
├── tests/                # Jest tests (unit, integration, AI, components)
├── docs/                 # Architecture, deployment, design system, API reference
├── assets/               # Images, icons, splash screens
├── app.json              # Expo configuration
├── eas.json              # EAS build profiles
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |
| `npm test` | Run Jest tests |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check |
| `npm run build:android` | EAS build Android |
| `npm run build:ios` | EAS build iOS |

## Testing

```bash
npm test
```

Tests cover:
- Julian day calculations
- Moon phase accuracy (New Moon, Full Moon)
- Sun sign determination
- Birth chart generation
- Tarot shuffle determinism
- Zustand store logic (auth, history, promo codes, referrals)
- AI API integration (fallback behavior)
- Error boundary rendering
- Component rendering
- Edge cases (leap years, year boundaries)

## Astrological Accuracy

All calculations use real astronomical algorithms:
- **Julian Day** conversion for precise date math
- **Moon phase** using synodic month (29.53058867 days)
- **Sun longitude** using orbital elements with aberration correction
- **Moon longitude** using Meeus algorithm approximation
- **Planetary positions** using mean orbital elements
- **Aspects** calculated with standard orbs (8°)

## AI Integration

Free AI-powered features using HuggingFace Inference API:
- **Horoscope Enhancement** — Poetic AI-generated enhancements
- **Tarot Interpretation** — Deeper, personalized card readings
- **Dream Analysis** — Subconscious symbol interpretation
- **Compatibility Analysis** — AI-powered relationship insights
- **Numerology Insights** — Spiritual number meanings
- **Sentiment Analysis** — Dream mood detection
- **Affirmation Generation** — Personalized cosmic affirmations

All AI features have graceful fallbacks when offline or API limits reached.

## Monetization

### 4 Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 3 readings/day, ads, basic horoscope |
| Premium | $9.99/mo | Unlimited readings, tarot, AI insights, no ads |
| Pro | $29.99/mo | Everything + birth chart, transits, dream, compatibility |
| Elite | $99.99/mo | Everything + numerology, data export, 1-on-1 astrologer |

### Setup

1. Configure RevenueCat or direct IAP in `src/constants/revenuecat.ts`
2. Configure AdMob in `src/constants/ads.ts`
3. See `docs/deployment.md` for full store setup instructions

### Promo Codes

Built-in promo codes for marketing:
- `COSMIC50` — 50% off Premium
- `STARZPRO` — 30% off Pro
- `NEWMOON` — 100% off Premium (limited)
- `ELITE2024` — 25% off Elite

### Referral Program

Refer 3 friends to unlock Premium for free. Track referrals in Profile.

### Master Access Code

Enter the master code in Subscription screen to unlock Elite tier instantly. Code is configured via `MASTER_ACCESS_CODE` environment variable.

## Build & Deploy

### Development Build

```bash
eas build --profile development
```

### Production Build

```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

See `docs/store-deployment.md` for complete App Store and Google Play submission guides.

## Design System

See `docs/DesignSystem.md` for:
- Color palette (cosmic dark theme with star golds)
- Typography scale
- Spacing system
- Animation guidelines

## Documentation

- `docs/architecture.md` — System design and data flow
- `docs/getting-started.md` — Developer onboarding
- `docs/api-reference.md` — All integrated APIs
- `docs/monetization.md` — Tier system, pricing, promo codes
- `docs/competitor-analysis.md` — Market analysis and differentiation
- `docs/user-simulation.md` — Persona testing and UX improvements
- `docs/store-deployment.md` — Step-by-step submission guide

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Made with 💫 by the Starz Cosmic Oracle team.*
