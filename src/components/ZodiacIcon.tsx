import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ZodiacSign } from '../types';
import { ZODIAC_EMOJIS, ZODIAC_ELEMENTS } from '../constants/astrology';
import { Colors } from '../constants/colors';

interface ZodiacIconProps {
  sign: ZodiacSign;
  size?: number;
  showElement?: boolean;
}

const elementColors = {
  Fire: Colors.sunOrange,
  Earth: Colors.jupiterGold,
  Air: Colors.uranusCyan,
  Water: Colors.neptuneBlue,
};

export const ZodiacIcon: React.FC<ZodiacIconProps> = ({ sign, size = 48, showElement = true }) => {
  const element = ZODIAC_ELEMENTS[sign];
  const color = elementColors[element];
  return (
    <View style={[styles.container, { width: size, height: size, borderColor: color }]}>
      <Text style={[styles.emoji, { fontSize: size * 0.55 }]} >{ZODIAC_EMOJIS[sign]}</Text>
      {showElement && <View style={[styles.elementDot, { backgroundColor: color }]} />}
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
  elementDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
