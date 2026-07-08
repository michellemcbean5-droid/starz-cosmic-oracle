import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

interface UpgradePromptProps {
  feature: string;
  tier: 'premium' | 'pro' | 'elite';
  onUpgrade: () => void;
  onDismiss: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  tier,
  onUpgrade,
  onDismiss,
}) => {
  const tierNames = { premium: 'Premium', pro: 'Pro', elite: 'Elite' };
  const tierColors = { premium: Colors.info, pro: Colors.starGold, elite: '#FF6BFF' };

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: tierColors[tier] }]}>
        <Text style={styles.badgeText}>{tierNames[tier]}</Text>
      </View>
      <Text style={styles.title}>Unlock {feature}</Text>
      <Text style={styles.message}>
        Upgrade to {tierNames[tier]} to access {feature} and many more cosmic features.
      </Text>
      <TouchableOpacity style={[styles.upgradeBtn, { backgroundColor: tierColors[tier] }]} onPress={onUpgrade}>
        <Text style={styles.upgradeBtnText}>✨ Upgrade to {tierNames[tier]}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
        <Text style={styles.dismissText}>Maybe later</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    margin: 16,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  badgeText: {
    color: Colors.cosmicBlack,
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  upgradeBtn: {
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  upgradeBtnText: {
    color: Colors.cosmicBlack,
    fontWeight: 'bold',
    fontSize: 15,
  },
  dismissBtn: {
    marginTop: 12,
    padding: 8,
  },
  dismissText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
