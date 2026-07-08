import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Planet } from '../types';
import { PLANET_EMOJIS, PLANET_COLORS } from '../constants/astrology';
import { Colors } from '../constants/colors';

interface PlanetBadgeProps {
  planet: Planet;
  sign: string;
  degree?: number;
  isRetrograde?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PlanetBadge: React.FC<PlanetBadgeProps> = ({ planet, sign, degree, isRetrograde, size = 'md' }) => {
  const sizeMap = { sm: 28, md: 40, lg: 56 };
  const s = sizeMap[size];
  return (
    <View style={[styles.container, { width: s, height: s, borderColor: PLANET_COLORS[planet] }]}>
      <Text style={[styles.emoji, { fontSize: s * 0.45 }]} >{PLANET_EMOJIS[planet]}</Text>
      {isRetrograde && <Text style={styles.retro}>℞</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  emoji: {
    color: Colors.textPrimary,
  },
  retro: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 10,
    color: Colors.error,
    fontWeight: 'bold',
  },
});
