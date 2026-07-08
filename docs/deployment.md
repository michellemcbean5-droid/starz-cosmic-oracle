# Starz Cosmic Oracle — Deployment Guide

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

1. Run `eas build --platform ios --profile production`
2. EAS generates an `.ipa` and optionally uploads to App Store Connect
3. Go to App Store Connect → My Apps → Starz Cosmic Oracle
4. Fill in: App name, subtitle, description, keywords, screenshots
5. Set pricing (Free with IAP)
6. Add in-app purchase products in App Store Connect matching `constants/revenuecat.ts`
7. Submit for review (typically 24-48 hours)

## Android Google Play Submission

1. Run `eas build --platform android --profile production`
2. EAS generates an `.aab` (Android App Bundle)
3. Go to Google Play Console → Starz Cosmic Oracle
4. Create release → Upload AAB
5. Fill in store listing (title, description, screenshots)
6. Set pricing (Free with IAP)
7. Add in-app products in Google Play Console
8. Roll out to internal testing → closed testing → production

## In-App Purchase Setup

### RevenueCat
1. Create account at https://app.revenuecat.com
2. Add app with bundle IDs
3. Create offerings: `premium_monthly`, `pro_monthly`
4. Configure Apple / Google credentials
5. Replace `REVENUECAT_API_KEY` in `constants/revenuecat.ts`

### Direct IAP (Alternative)
1. Configure products in App Store Connect / Google Play Console
2. Update `IAPProductIds` in `constants/revenuecat.ts`
3. Use `react-native-iap` to handle purchases directly

## AdMob Setup (Free Tier)

1. Create AdMob account at https://admob.google.com
2. Add app with bundle IDs
3. Create interstitial ad unit
4. Replace ad unit IDs in `constants/ads.ts`
5. Initialize `react-native-google-mobile-ads` in `App.tsx`

## Environment Variables

Create `.env` in project root (never commit):
```
REVENUECAT_IOS_KEY=appl_...
REVENUECAT_ANDROID_KEY=goog_...
ADMOB_IOS_APP_ID=ca-app-pub-...
ADMOB_ANDROID_APP_ID=ca-app-pub-...
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/eas-build.yml`) automatically triggers EAS builds on push to `main`. Ensure `EXPO_TOKEN` is set as a GitHub secret.

## Post-Launch

- Monitor crash reports in Firebase / Sentry
- Track IAP revenue in RevenueCat dashboard
- A/B test subscription pricing
- Collect user feedback for horoscope accuracy improvements
