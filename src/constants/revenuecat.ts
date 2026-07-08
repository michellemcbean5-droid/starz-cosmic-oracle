/**
 * RevenueCat Configuration
 * In production, use environment variables for API keys.
 */
export const RevenueCatConfig = {
  iosApiKey: 'appl_YOUR_REVENUECAT_IOS_KEY',
  androidApiKey: 'goog_YOUR_REVENUECAT_ANDROID_KEY',
  offerings: {
    premium: 'premium_monthly',
    pro: 'pro_monthly',
  },
  entitlementIds: {
    premium: 'premium',
    pro: 'pro',
  },
};

export const IAPProductIds = {
  ios: {
    premium: 'com.starz.cosmicoracle.premium_monthly',
    pro: 'com.starz.cosmicoracle.pro_monthly',
  },
  android: {
    premium: 'com.starz.cosmicoracle.premium_monthly',
    pro: 'com.starz.cosmicoracle.pro_monthly',
  },
};
