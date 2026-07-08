# Starz Cosmic Oracle — Monetization Guide

## Subscription Tiers

### Tier 1: Free ($0/month)
**Target**: Casual users, try-before-buy

**Features**:
- 3 daily readings (horoscope, tarot, or any combination)
- Basic horoscope (no AI enhancement)
- Moon phase tracker
- Ad-supported (banner + interstitial)
- Reading history (last 10 readings)

**Limitations**:
- No birth chart
- No planetary transits
- No dream interpretation
- No compatibility analysis
- No numerology
- Ads shown every 2 readings
- Cannot share readings

**Conversion Strategy**:
- Show upgrade prompt after 2nd daily reading
- "You've used 2/3 readings today" progress indicator
- Lock premium features with "Upgrade to unlock" overlays

---

### Tier 2: Premium ($9.99/month)
**Target**: Regular astrology enthusiasts

**Features**:
- Unlimited daily readings
- AI-enhanced horoscopes (poetic flair, cosmic whispers)
- Full tarot readings with AI interpretation
- Moon phase tracker + calendar
- Ad-free experience
- Full reading history (100 items)
- Share readings on social media
- Daily push notifications

**Conversion Strategy**:
- Highlight as "Best Value" in UI
- 7-day free trial
- Promo code: `COSMIC50` (50% off first month)
- Referral: 3 friends = free Premium

---

### Tier 3: Pro ($29.99/month)
**Target**: Serious astrology practitioners

**Features**:
- Everything in Premium
- Full birth chart (Big Three + all planets)
- Planetary transits with retrograde tracking
- Dream interpretation with AI + sentiment analysis
- Zodiac compatibility analysis with AI insights
- Priority support
- Custom notification schedules
- Export readings as images

**Conversion Strategy**:
- Show birth chart preview with "Unlock with Pro" overlay
- Dream interpretation teaser: "Upgrade to unlock the full meaning"
- Promo code: `STARZPRO` (30% off first month)

---

### Tier 4: Elite ($99.99/month)
**Target**: Professional astrologers, power users

**Features**:
- Everything in Pro
- Numerology insights + life path calculations
- Data export (CSV, JSON)
- Custom notification sounds
- Exclusive cosmic events calendar
- 1-on-1 astrologer access (monthly consultation)
- White-label sharing (remove app branding)
- Early access to new features
- Master access code bypass

**Conversion Strategy**:
- Limited availability messaging
- "For serious cosmic seekers"
- Promo code: `ELITE2024` (25% off)

---

## Revenue Model

### Primary Revenue
| Source | Expected % | Notes |
|--------|-----------|-------|
| Premium subscriptions | 60% | Main revenue driver |
| Pro subscriptions | 25% | Higher ARPU |
| Elite subscriptions | 10% | Very high ARPU, low volume |
| Ad revenue (free tier) | 5% | Supplementary |

### Annual vs Monthly
- Offer 20% discount for annual billing
- Annual Premium: $95.99/year (vs $119.88 monthly)
- Annual Pro: $287.99/year (vs $359.88 monthly)
- Annual Elite: $959.99/year (vs $1199.88 monthly)

## Promo Codes

### Built-in Codes

| Code | Tier | Discount | Uses | Expires |
|------|------|----------|------|---------|
| `COSMIC50` | Premium | 50% | 100 | 2025-12-31 |
| `STARZPRO` | Pro | 30% | 50 | 2025-12-31 |
| `NEWMOON` | Premium | 100% | 200 | 2025-06-30 |
| `ELITE2024` | Elite | 25% | 20 | 2025-12-31 |

### Adding New Codes

Edit `src/stores/useAuthStore.ts`:
```typescript
const PROMO_CODES: Record<string, PromoCode> = {
  'YOURCODE': {
    code: 'YOURCODE',
    tier: 'premium',
    discountPercent: 40,
    expiresAt: '2025-12-31',
    usesRemaining: 50,
  },
};
```

## Master Access Code

The master access code unlocks Elite tier instantly. It's stored as an environment variable:

```bash
# .env
MASTER_ACCESS_CODE=STARZ-ELITE-2024
```

Default code: `STARZ-ELITE-2024`

Users enter the code in the Subscription screen's promo code input. The code is checked before promo codes and grants `elite` subscription + `masterAccessVerified: true`.

## Referral Program

**Mechanics**:
- Each user gets a unique referral link
- Referred user installs + opens app = 1 referral credit
- 3 referrals = free Premium tier
- Referral count tracked in `user.referralsCount`

**Implementation**:
- `useAuthStore.addReferral()` increments count
- Auto-upgrades to Premium at 3 referrals
- Display progress: "Refer 2 more friends for free Premium!"

## Upgrade Prompts

### Strategic Moments
1. **After 2nd free reading** — "You've used 2/3 readings. Upgrade for unlimited!"
2. **When tapping locked feature** — "Birth Chart requires Pro. Upgrade?"
3. **After positive reading** — "Love your reading? Unlock more with Premium!"
4. **On app launch (day 3)** — "Ready for deeper cosmic insights?"
5. **During retrograde** — "Mercury is retrograde. Pro users get detailed transit analysis."

### Implementation
Use the `UpgradePrompt` component:
```tsx
<UpgradePrompt
  feature="Birth Chart"
  tier="pro"
  onUpgrade={() => navigation.navigate('Subscription')}
  onDismiss={() => setShowPrompt(false)}
/>
```

## Ad Strategy (Free Tier)

### Ad Types
- **Banner**: Always visible at bottom of free tier screens
- **Interstitial**: Show after every 2nd reading
- **Rewarded**: "Watch a video to get 1 extra reading today"

### AdMob Setup
1. Create AdMob account
2. Add app with bundle IDs
3. Create ad units in AdMob dashboard
4. Update `src/constants/ads.ts` with real IDs
5. Initialize in `App.tsx`

## Analytics & Tracking

### Events to Track
- `reading_started` — User begins any reading
- `reading_completed` — User finishes reading
- `upgrade_prompt_shown` — Upgrade prompt displayed
- `upgrade_prompt_dismissed` — User dismissed prompt
- `subscription_purchased` — IAP completed
- `promo_code_applied` — Code used successfully
- `referral_completed` — New user from referral
- `ad_impression` — Ad shown
- `ad_clicked` — Ad tapped

### Tools
- **RevenueCat**: Built-in analytics for IAP
- **PostHog** (optional): Open-source product analytics
- **Plausible** (optional): Privacy-friendly analytics

## A/B Testing Ideas

1. **Pricing**: Test $7.99 vs $9.99 for Premium
2. **Trial length**: Test 7-day vs 14-day free trial
3. **Prompt timing**: Test prompt after 1st vs 2nd reading
4. **Feature gating**: Test which features drive most upgrades
5. **Referral threshold**: Test 2 vs 3 vs 5 referrals for free Premium

## Compliance

- **App Store**: Free app with IAP. No auto-subscribe without consent.
- **Google Play**: Same. Must disclose subscription terms.
- **GDPR**: Users can delete account/data. No data sold to third parties.
- **COPPA**: Not targeted at children under 13.

## Revenue Projections

| Tier | Monthly Price | Conversion Rate | Monthly Revenue (per 1000 users) |
|------|--------------|----------------|--------------------------------|
| Free | $0 | 85% | $5 (ads) |
| Premium | $9.99 | 10% | $999 |
| Pro | $29.99 | 3% | $899 |
| Elite | $99.99 | 0.5% | $499 |

**Total ARPU**: ~$24/month per 1000 active users

## Implementation Checklist

- [ ] Configure RevenueCat with real API keys
- [ ] Set up App Store Connect products
- [ ] Set up Google Play Console products
- [ ] Update AdMob with real ad unit IDs
- [ ] Test IAP on physical device
- [ ] Test promo code flow
- [ ] Test referral flow
- [ ] Verify subscription restoration
- [ ] Add subscription terms to app
- [ ] Set up analytics tracking
