# Starz Cosmic Oracle — API Reference

## Astrology APIs (Local Calculations)

All astrology calculations are pure functions in `src/utils/astroCalculations.ts`. No external API calls required.

### `toJulianDay(date: Date): number`
Converts a Date to Julian Day number for astronomical calculations.

### `calculateMoonPhase(date: Date): MoonPhase`
Returns moon phase name, illumination percentage, age in days, and emoji.

### `calculateSunLongitude(date: Date): number`
Returns sun's ecliptic longitude (0-360°).

### `calculateSunSign(birthDate: Date): ZodiacSign`
Determines zodiac sign from birth date.

### `calculateMoonSign(birthDate: Date): ZodiacSign`
Determines moon sign from birth date.

### `calculateRisingSign(birthDate: Date, birthLocation?: string): ZodiacSign`
Simplified rising sign calculation based on birth time.

### `generateBirthChart(birthDate, birthTime, birthLocation): BirthChartData`
Full natal chart with Big Three, planetary positions, houses, and aspects.

### `calculateTransits(date: Date): PlanetTransit[]`
Current planetary positions with retrograde status and influences.

### `generateHoroscope(sign, date): HoroscopeReading`
Deterministic daily horoscope using seeded PRNG.

### `shuffleTarot(seed: number): number[]`
Fisher-Yates shuffle with seed for reproducible tarot draws.

## AI APIs (HuggingFace Inference — Free Tier)

All AI functions in `src/api/ai.ts`. Graceful fallbacks when offline.

### `enhanceHoroscope(baseText: string, sign: string): Promise<string>`
Uses `gpt2` model to add poetic flair to horoscopes.
- **Fallback**: Returns original text
- **Rate limit**: 10k requests/month (free tier)

### `enhanceTarotReading(cards: string[], question?: string): Promise<string>`
Generates deeper tarot interpretations using `gpt2`.
- **Fallback**: Returns empty string (base interpretation used)

### `analyzeCompatibility(sign1: string, sign2: string): Promise<string>`
AI-powered compatibility analysis.
- **Fallback**: Generic compatibility message

### `interpretDream(dreamText: string): Promise<string>`
Dream interpretation using `gpt2`.
- **Fallback**: Mystical default message

### `generateAffirmation(sign: string, mood: string): Promise<string>`
Personalized affirmations.
- **Fallback**: Generic cosmic affirmation

### `analyzeNumerology(number: number): Promise<string>`
Numerology insights.
- **Fallback**: Generic vibrational energy message

### `analyzeSentiment(text: string): Promise<{label: string, score: number}>`
Sentiment analysis using `distilbert-base-uncased-finetuned-sst-2-english`.
- **Fallback**: `{label: 'NEUTRAL', score: 0.5}`

### `generateLocalFortune(sign: string, seed: number): string`
**Offline function** — no API call. Deterministic fortune generator.

### `generateCosmicSummary(sign, mood, luckyNumber): Promise<object>`
Combines multiple AI features into one daily reading bundle.

## Data Storage APIs

### `Storage.get<T>(key: string): Promise<T | null>`
AsyncStorage wrapper with JSON parsing.

### `Storage.set(key: string, value: unknown): Promise<void>`
AsyncStorage wrapper with JSON serialization.

### `Storage.remove(key: string): Promise<void>`
Remove item from AsyncStorage.

### `Storage.clear(): Promise<void>`
Clear all AsyncStorage.

## State Management APIs

### `useAuthStore`
- `loadUser()` — Load user from AsyncStorage, reset daily counts
- `setUser(user)` — Save user profile
- `updateSubscription(tier)` — Change subscription tier
- `incrementReadingCount()` — Track daily usage
- `canRead()` — Check if user can perform a reading
- `resetDailyReadings()` — Reset daily counter
- `applyPromoCode(code)` — Apply promo code (returns `{success, message}`)
- `applyMasterCode(code)` — Apply master access code
- `addReferral()` — Increment referral count, auto-upgrade at 3
- `getTierLimits()` — Get feature list for current tier

### `useHistoryStore`
- `loadHistory()` — Load all history types from AsyncStorage
- `addReading(item)` — Add to reading history (max 100)
- `addDream(dream)` — Add dream interpretation (max 50)
- `addCompatibility(comp)` — Add compatibility result (max 50)
- `addNumerology(reading)` — Add numerology reading (max 50)
- `clearHistory()` / `clearDreams()` / `clearCompatibilities()` / `clearNumerology()`

## Notification APIs

### `requestNotificationPermissions(): Promise<boolean>`
Request push notification permissions.

### `scheduleDailyHoroscope(hour: number): Promise<string>`
Schedule daily horoscope notification at specified hour.

### `scheduleMoonEvent(title, body, date): Promise<string>`
Schedule one-time moon event notification.

### `cancelAllNotifications(): Promise<void>`
Cancel all scheduled notifications.

## Navigation APIs

### Root Stack Screens
- `MainTabs` — Bottom tab navigator
- `BirthChart` — Natal chart calculator
- `Subscription` — Plans and pricing
- `History` — Reading history
- `Compatibility` — Zodiac compatibility
- `Dream` — Dream interpretation
- `Numerology` — Number analysis

### Tab Screens
- `Home` — Daily horoscope
- `Tarot` — Card readings
- `Moon` — Moon phases
- `Planets` — Planetary transits
- `Profile` — User settings

## Monetization APIs

### `RevenueCatConfig`
Configuration in `src/constants/revenuecat.ts`:
- iOS/Android API keys
- Offering IDs: `premium_monthly`, `pro_monthly`
- Entitlement IDs: `premium`, `pro`

### `IAPProductIds`
Product IDs for direct IAP:
- iOS: `com.starz.cosmicoracle.premium_monthly`, `com.starz.cosmicoracle.pro_monthly`
- Android: Same IDs

### `AdConfig`
AdMob configuration in `src/constants/ads.ts`:
- iOS/Android App IDs
- Interstitial ad unit IDs
- Test device IDs

## Promo Codes

Built-in codes (defined in `useAuthStore`):
| Code | Tier | Discount | Expires |
|------|------|----------|---------|
| COSMIC50 | Premium | 50% | 2025-12-31 |
| STARZPRO | Pro | 30% | 2025-12-31 |
| NEWMOON | Premium | 100% | 2025-06-30 |
| ELITE2024 | Elite | 25% | 2025-12-31 |

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `HF_API_TOKEN` | HuggingFace API access | No (free works without) |
| `MASTER_ACCESS_CODE` | Elite tier unlock code | No (has default) |
| `REVENUECAT_IOS_KEY` | RevenueCat iOS | For production IAP |
| `REVENUECAT_ANDROID_KEY` | RevenueCat Android | For production IAP |
| `ADMOB_IOS_APP_ID` | AdMob iOS | For production ads |
| `ADMOB_ANDROID_APP_ID` | AdMob Android | For production ads |
| `EXPO_TOKEN` | EAS CI/CD | For GitHub Actions |
