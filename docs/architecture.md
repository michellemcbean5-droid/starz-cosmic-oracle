# Starz Cosmic Oracle — Architecture

## Overview

Starz Cosmic Oracle is a React Native / Expo mobile app built with a modular, layered architecture. It provides 11 cosmic features powered by deterministic astronomical calculations and optional AI enhancements via free HuggingFace API.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.76.9 + Expo SDK 52 |
| Navigation | React Navigation (Bottom Tabs + Stack) |
| State | Zustand |
| Styling | StyleSheet + Expo LinearGradient / Blur |
| Animation | React Native Reanimated |
| Storage | AsyncStorage |
| Notifications | Expo Notifications |
| Payments | react-native-iap + RevenueCat (ready) |
| Ads | react-native-google-mobile-ads (ready) |
| AI | HuggingFace Inference API (free tier, 10k req/month) |
| Error Handling | React Error Boundaries + graceful fallbacks |

## Directory Structure

```
src/
├── api/              # Data layer — astrology calculations + AI integration
├── components/       # Reusable UI (Starfield, CosmicCard, ErrorBoundary, Skeleton, etc.)
├── constants/        # Colors, typography, astrology data, monetization config
├── hooks/            # Custom React hooks (useAuth, useDailyReset)
├── navigation/       # Root and Tab navigators (11 screens)
├── screens/          # 11 feature screens
├── stores/           # Zustand stores (auth, history, promo codes, referrals)
├── types/            # TypeScript type definitions
├── utils/            # Astro calculations, theme, storage, notifications
├── App.tsx           # Entry point with ErrorBoundary wrapper
```

## Data Flow

1. **User action** → Screen component
2. **Screen** → calls API function or Zustand store action
3. **API** → uses astro calculations (pure functions) or calls AI API with fallback
4. **Store** → updates state + persists to AsyncStorage
5. **Component** → re-renders with new state

## Key Patterns

- **Pure calculations**: All astrology math is in `utils/astroCalculations.ts` with no side effects
- **Deterministic readings**: Horoscopes and tarot shuffles are seeded by date so same inputs = same outputs
- **Feature gates**: Subscription checks live in `useAuthStore.canRead()` and `getTierLimits()`
- **Local-first**: All data is stored locally; no backend required for core features
- **AI with fallback**: All AI features wrap API calls in try/catch with graceful offline fallbacks
- **Error boundaries**: App-level ErrorBoundary catches crashes and shows recovery UI
- **Skeleton loading**: Loading states prevent blank screens during data fetch

## Screen Architecture

### Bottom Tabs (5 screens)
- **Home** — Daily horoscope with AI enhancement, zodiac selector
- **Tarot** — 3-card draw with flip animations, AI interpretation
- **Moon** — Moon phase tracker + lunar calendar + wisdom guide
- **Planets** — Planetary transits grid with detail cards
- **Profile** — User settings, notifications, subscription status

### Stack Screens (6 additional)
- **BirthChart** — Full natal chart (Pro+ tier)
- **Subscription** — 4-tier plans + promo codes + referrals
- **History** — Categorized reading history (horoscope, tarot, dream, compatibility, numerology)
- **Compatibility** — Zodiac compatibility with AI analysis (Pro+ tier)
- **Dream** — Dream interpretation with sentiment analysis (Pro+ tier)
- **Numerology** — Life path + number analysis (Elite tier)

## Monetization Architecture

| Tier | Price | Limitations | Features |
|------|-------|-------------|----------|
| Free | $0 | 3 readings/day, ads | Basic horoscope, moon tracker |
| Premium | $9.99/mo | Unlimited, no ads | + AI horoscope, tarot, history |
| Pro | $29.99/mo | Everything | + Birth chart, transits, dream, compatibility |
| Elite | $99.99/mo | Everything | + Numerology, data export, 1-on-1 astrologer |

**Backend**: RevenueCat / IAP for subscriptions, AdMob for free tier ads
**Promo Codes**: Built-in system with expiration and usage limits
**Master Code**: Environment variable for instant Elite access
**Referrals**: 3 friends = free Premium tier

## AI Integration Architecture

### HuggingFace Inference API (Free Tier)
- `enhanceHoroscope()` — GPT-2 poetic enhancement
- `enhanceTarotReading()` — GPT-2 deeper interpretation
- `analyzeCompatibility()` — GPT-2 relationship insights
- `interpretDream()` — GPT-2 dream analysis
- `generateAffirmation()` — GPT-2 personalized affirmations
- `analyzeNumerology()` — GPT-2 number insights
- `analyzeSentiment()` — DistilBERT sentiment analysis

### Offline Fallbacks
- All AI functions return base content if API fails
- `generateLocalFortune()` — deterministic offline fortune generator
- `generateCosmicSummary()` — bundles multiple offline features

## State Management

### useAuthStore (Zustand)
- User profile (name, birth data, sign, subscription)
- Daily reading limits and reset logic
- Subscription tier management
- Promo code validation and application
- Master access code verification
- Referral tracking and auto-upgrade

### useHistoryStore (Zustand)
- Reading history (max 100 items)
- Dream interpretations (max 50)
- Compatibility results (max 50)
- Numerology readings (max 50)
- All persisted to AsyncStorage

## Testing Architecture

- **Unit tests**: Astro calculations, store logic, AI fallbacks
- **Integration tests**: Component rendering, navigation flows
- **Mock strategy**: All external APIs mocked in `tests/setup.ts`
- **Coverage**: Calculations, stores, AI, components, edge cases

## Build Pipeline

- EAS Build via `eas.json` (development, preview, production)
- GitHub Actions workflow triggers EAS builds on push to main
- Manual dispatch for production builds
- App signed with bundle IDs `com.starz.cosmicoracle` (iOS + Android)

## Security

- No secrets committed to repo (`.env` in `.gitignore`)
- `.env.example` documents required variables
- Master access code stored in environment variable
- API keys for production services in environment variables only
- All personal data stored locally on device

## Performance

- Deterministic calculations avoid API calls for core features
- AsyncStorage for instant local persistence
- Skeleton loading prevents blank screens
- Error boundaries prevent crash loops
- Starfield animation optimized with Reanimated native driver
