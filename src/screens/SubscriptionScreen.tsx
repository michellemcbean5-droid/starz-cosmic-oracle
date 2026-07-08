import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarfieldBackground, CosmicCard, PromoCodeInput } from '../components';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../stores/useAuthStore';

const TIERS = [
  {
    key: 'free' as const,
    name: 'Free',
    price: '$0',
    period: '/mo',
    features: ['3 daily readings', 'Basic horoscope', 'Moon phase tracker', 'Ad-supported'],
    cta: 'Current Plan',
    highlight: false,
    color: Colors.textMuted,
  },
  {
    key: 'premium' as const,
    name: 'Premium',
    price: '$9.99',
    period: '/mo',
    features: ['Unlimited readings', 'Daily horoscope', 'Moon phase tracker', 'Tarot readings', 'AI-enhanced insights', 'Ad-free experience'],
    cta: 'Upgrade to Premium',
    highlight: true,
    color: Colors.info,
  },
  {
    key: 'pro' as const,
    name: 'Pro',
    price: '$29.99',
    period: '/mo',
    features: ['Everything in Premium', 'Full birth chart', 'Planetary transits', 'Dream interpretation', 'Compatibility analysis', 'Priority support'],
    cta: 'Upgrade to Pro',
    highlight: false,
    color: Colors.starGold,
  },
  {
    key: 'elite' as const,
    name: 'Elite',
    price: '$99.99',
    period: '/mo',
    features: ['Everything in Pro', 'Numerology insights', 'Data export', 'Custom notifications', 'Exclusive cosmic events', '1-on-1 astrologer access', 'White-label sharing'],
    cta: 'Upgrade to Elite',
    highlight: false,
    color: '#FF6BFF',
  },
];

export const SubscriptionScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const updateSubscription = useAuthStore((s) => s.updateSubscription);
  const addReferral = useAuthStore((s) => s.addReferral);

  const handleSubscribe = async (tier: 'free' | 'premium' | 'pro' | 'elite') => {
    if (tier === 'free') {
      await updateSubscription('free');
      Alert.alert('Done', 'You are now on the Free plan.');
      return;
    }
    Alert.alert('Subscription', `In a real app, this would initiate purchase for ${tier}. For now, we'll activate it.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Activate', onPress: async () => { await updateSubscription(tier); Alert.alert('Success', `${tier.charAt(0).toUpperCase() + tier.slice(1)} activated!`); } },
    ]);
  };

  const handleReferral = async () => {
    await addReferral();
    Alert.alert('Referral Added', 'Thanks for sharing! Refer 3 friends to unlock Premium for free.');
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>💎 Cosmic Plans</Text>
          <Text style={styles.subtitle}>Unlock the full universe</Text>

          {TIERS.map((tier) => (
            <CosmicCard
              key={tier.key}
              style={[styles.tierCard, tier.highlight && styles.tierCardHighlight]}
              gradient={true}
            >
              {tier.highlight && <View style={styles.badge}><Text style={styles.badgeText}>Best Value</Text></View>}
              <View style={styles.tierHeader}>
                <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: tier.color }]}>{tier.price}</Text>
                  <Text style={styles.period}>{tier.period}</Text>
                </View>
              </View>
              <View style={styles.features}>
                {tier.features.map((feat, i) => (
                  <Text key={i} style={styles.feature}>✓ {feat}</Text>
                ))}
              </View>
              <TouchableOpacity
                style={[
                  styles.ctaBtn,
                  user?.subscription === tier.key && styles.ctaBtnActive,
                  tier.highlight && styles.ctaBtnHighlight,
                ]}
                onPress={() => handleSubscribe(tier.key)}
                disabled={user?.subscription === tier.key}
              >
                <Text style={styles.ctaText}>
                  {user?.subscription === tier.key ? '✓ Active' : tier.cta}
                </Text>
              </TouchableOpacity>
            </CosmicCard>
          ))}

          <PromoCodeInput />

          <CosmicCard style={styles.referralCard}>
            <Text style={styles.referralTitle}>🎁 Referral Program</Text>
            <Text style={styles.referralText}>
              Share Starz Cosmic Oracle with friends. Refer 3 friends and unlock Premium for free!
            </Text>
            <Text style={styles.referralCount}>
              Current referrals: {user?.referralsCount || 0}/3
            </Text>
            <TouchableOpacity style={styles.referralBtn} onPress={handleReferral}>
              <Text style={styles.referralBtnText}>📤 Share with Friends</Text>
            </TouchableOpacity>
          </CosmicCard>

          <Text style={styles.terms}>
            Subscriptions auto-renew. Cancel anytime in your app store settings. RevenueCat integration ready for production.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cosmicBlack },
  safeArea: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  tierCard: { marginBottom: 16, position: 'relative' },
  tierCardHighlight: { borderColor: Colors.starGold, borderWidth: 2 },
  badge: { position: 'absolute', top: -10, right: 16, backgroundColor: Colors.starGold, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: Colors.cosmicBlack },
  tierHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tierName: { fontSize: 20, fontWeight: 'bold' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 28, fontWeight: 'bold' },
  period: { fontSize: 14, color: Colors.textSecondary, marginLeft: 4 },
  features: { marginTop: 12, marginBottom: 16 },
  feature: { fontSize: 14, color: Colors.textSecondary, marginVertical: 3 },
  ctaBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.cardBorder },
  ctaBtnActive: { backgroundColor: 'rgba(46, 204, 113, 0.2)', borderColor: Colors.success },
  ctaBtnHighlight: { backgroundColor: Colors.primary, borderColor: Colors.primaryLight },
  ctaText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  referralCard: { marginTop: 16, marginBottom: 16 },
  referralTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold, marginBottom: 8 },
  referralText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  referralCount: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  referralBtn: { backgroundColor: Colors.primary, borderRadius: 8, padding: 12, alignItems: 'center' },
  referralBtnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 14 },
  terms: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 24 },
});
