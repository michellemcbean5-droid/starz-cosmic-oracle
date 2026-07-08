# Starz Cosmic Oracle — Getting Started

## Quick Start for New Developers

### 1. Prerequisites

- **Node.js** >= 18 (check with `node --version`)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli`
- **Git**

### 2. Clone & Install

```bash
git clone https://github.com/michellemcbean5-droid/starz-cosmic-oracle.git
cd starz-cosmic-oracle
npm install
```

### 3. Environment Setup

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your actual keys (never commit this file!)
```

Required for production builds:
- `REVENUECAT_IOS_KEY` / `REVENUECAT_ANDROID_KEY` — for in-app purchases
- `ADMOB_IOS_APP_ID` / `ADMOB_ANDROID_APP_ID` — for ads (free tier)
- `HF_API_TOKEN` — for enhanced AI features (optional, free tier works without)

### 4. Start Development

```bash
# Start Expo dev server
npm start

# Or directly on platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web preview
```

### 5. Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

### 6. Code Quality

```bash
# TypeScript check
npm run typecheck

# ESLint
npm run lint

# Fix lint issues
npm run lint:fix
```

## Project Architecture

### Data Flow

1. User taps a button on a **Screen**
2. Screen calls an **API** function or **Zustand store** action
3. API uses **astro calculations** (pure functions) or calls **AI API**
4. Store updates state + persists to **AsyncStorage**
5. Component re-renders with new state

### Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Entry point, wraps app in ErrorBoundary |
| `src/navigation/RootNavigator.tsx` | Stack navigator definition |
| `src/navigation/MainTabNavigator.tsx` | Bottom tab navigator |
| `src/stores/useAuthStore.ts` | User auth, subscription, limits |
| `src/stores/useHistoryStore.ts` | Reading history, dreams, compatibility |
| `src/utils/astroCalculations.ts` | All astronomy math |
| `src/api/ai.ts` | AI integration (HuggingFace) |
| `src/constants/colors.ts` | Design system colors |
| `src/constants/astrology.ts` | Zodiac data, tarot deck |

### Adding a New Screen

1. Create `src/screens/YourScreen.tsx`
2. Export it in `src/screens/index.ts`
3. Add route in `src/navigation/RootNavigator.tsx` (or `MainTabNavigator.tsx`)
4. Add TypeScript type to `RootStackParamList`
5. Add test in `tests/` if it has business logic

### Adding an AI Feature

1. Add function to `src/api/ai.ts`
2. Always wrap in `try/catch` with graceful fallback
3. Export from `src/api/index.ts`
4. Call from screen component
5. Add test in `tests/ai.test.ts`

## Common Issues

### Metro bundler crashes
```bash
npx expo start --clear
```

### AsyncStorage not working in tests
Tests mock AsyncStorage automatically via `tests/setup.ts`.

### Starfield animation lags
Disable on low-end devices or reduce star count in `StarfieldBackground.tsx`.

### AI API returns errors
All AI features have offline fallbacks. Check network connection or the API may be rate-limited.

## Build for Production

```bash
# Configure EAS
eas login
eas build:configure

# Development build (for testing)
eas build --profile development

# Preview build (for QA)
eas build --profile preview

# Production build (for stores)
eas build --platform android --profile production
eas build --platform ios --profile production
```

See `docs/store-deployment.md` for full store submission guide.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes, add tests
3. Run `npm test && npm run lint && npm run typecheck`
4. Commit with descriptive message
5. Push and open PR

## Need Help?

- Check `docs/architecture.md` for system design
- Check `docs/api-reference.md` for API details
- Check `docs/monetization.md` for subscription setup
- Check `docs/store-deployment.md` for release process
