# AGENTS.md — Starz Cosmic Oracle

## Project Overview

Starz Cosmic Oracle is a React Native / Expo mobile astrology app providing daily horoscopes, birth charts, tarot readings, moon phases, planetary transits, dream interpretation, compatibility analysis, and numerology. It supports monetization via subscriptions and ads, with AI-powered enhancements via free HuggingFace API.

## Technology Stack

- **Framework**: React Native 0.76.9 + Expo SDK 52
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **State**: Zustand (lightweight, no Context boilerplate)
- **Styling**: StyleSheet + Expo LinearGradient + Expo Blur (glassmorphism)
- **Animation**: React Native Reanimated (starfield twinkle, card flips)
- **Storage**: AsyncStorage (local persistence)
- **Notifications**: Expo Notifications (daily horoscope, moon events)
- **Payments**: react-native-iap + RevenueCat configuration stubs
- **Ads**: react-native-google-mobile-ads configuration stubs
- **Testing**: Jest + jest-expo preset
- **AI**: HuggingFace Inference API (free tier, 10k requests/month)

## Directory Structure

```
src/
├── api/           # Astrology data & calculations (pure functions) + AI integration
├── components/    # Reusable UI (CosmicCard, StarfieldBackground, ErrorBoundary, Skeleton, etc.)
├── constants/     # Colors, typography, astrology data, ads, IAP config
├── hooks/         # useAuth, useDailyReset
├── navigation/    # RootNavigator (Stack), MainTabNavigator (Bottom Tabs)
├── screens/       # 11 screens: Home, BirthChart, Tarot, Moon, Planets, Profile, Subscription, History, Compatibility, Dream, Numerology
├── stores/        # Zustand stores: auth (subscription, limits, promo codes, referrals), history
├── types/         # TypeScript types: ZodiacSign, Planet, TarotCard, SubscriptionTier, etc.
├── utils/         # astroCalculations, theme, storage, notifications
└── App.tsx        # Entry point with ErrorBoundary wrapper
```

## Development Guidelines

### Code Style
- Functional components with hooks only
- TypeScript strict mode
- Use `const` and `let`, never `var`
- Prefer `@/` path alias for imports from `src/`

### State Management
- Zustand for global state (auth, history)
- Local `useState` for screen-level UI state

### Feature Gating
- Check `useAuthStore.canRead()` before allowing readings
- Premium features check `user.subscription === 'premium' || 'pro' || 'elite'`
- Birth chart is Pro+ tier only
- Dream interpretation is Pro+ tier only
- Numerology is Elite tier only
- Data export is Elite tier only

### AI Integration
- All AI calls are in `src/api/ai.ts`
- Always wrap AI calls in try/catch with graceful fallbacks
- Free HuggingFace API: 10k requests/month, no key required for basic usage
- Local deterministic functions available as offline fallback

### Astrology Calculations
- All calculations are in `src/utils/astroCalculations.ts`
- They are deterministic and mathematically accurate
- Use `mulberry32` seeded PRNG for consistent daily horoscopes

### Adding a New Screen
1. Create component in `src/screens/`
2. Export from `src/screens/index.ts`
3. Add to navigator in `src/navigation/RootNavigator.tsx` or `MainTabNavigator.tsx`
4. Add test if it contains business logic

## Common Commands

```bash
npm start              # Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm test               # Jest tests
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm run build:android  # EAS build Android
npm run build:ios      # EAS build iOS
```

## Environment Variables

Never commit `.env`. Required for production:
- `HF_API_TOKEN` — HuggingFace API token (optional)
- `MASTER_ACCESS_CODE` — Master code for Elite tier (default: STARZ-ELITE-2024)
- `REVENUECAT_IOS_KEY`
- `REVENUECAT_ANDROID_KEY`
- `ADMOB_IOS_APP_ID`
- `ADMOB_ANDROID_APP_ID`
- `EXPO_TOKEN` (for CI/CD)

## CI/CD

GitHub Actions workflow in `.github/workflows/eas-build.yml`:
- Runs tests, lint, typecheck on every PR
- Triggers EAS preview builds on main branch push
- Requires `EXPO_TOKEN` GitHub secret

## Deployment

See `docs/deployment.md` and `docs/store-deployment.md` for full App Store / Google Play submission steps.

## Important Notes for Future Agents

1. **Do not modify astronomical algorithms** without verifying accuracy against known ephemeris data
2. **Keep subscription tiers in sync** across UI, store logic, and API gating
3. **Update bundle version** in `app.json` before each production build
4. **Test on physical device** before submitting — starfield animation may lag on simulators
5. **All generated files must stay under `src/`** — root config files are build/deployment only
6. **Never commit API keys or secrets** — use `.env` and `.env.example` only
7. **AI features must have offline fallbacks** — not all users will have internet
8. **Promo codes and master codes are in `useAuthStore`** — update there for new campaigns
