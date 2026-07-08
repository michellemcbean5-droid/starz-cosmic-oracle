import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { TarotCard as TarotCardType } from '../types';
import { Colors } from '../constants/colors';

interface TarotCardProps {
  card: TarotCardType;
  index: number;
  onPress?: () => void;
  revealed?: boolean;
}

export const TarotCardComponent: React.FC<TarotCardProps> = ({ card, index, onPress, revealed = false }) => {
  const [flipped, setFlipped] = useState(revealed);
  const anim = React.useRef(new Animated.Value(0)).current;

  const flip = () => {
    if (onPress) onPress();
    Animated.spring(anim, {
      toValue: flipped ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
    }).start(() => setFlipped(!flipped));
  };

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });

  return (
    <TouchableOpacity onPress={flip} activeOpacity={0.8}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, { transform: [{ rotateY: frontRotate }] }]}>
          <View style={styles.cardBack}>
            <Text style={styles.cardBackText}>✨</Text>
            <Text style={styles.cardBackSub}>{index + 1}</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.card, styles.cardFront, { transform: [{ rotateY: backRotate }] }]}>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.cardArcana}>{card.arcana}{card.suit ? ` — ${card.suit}` : ''}</Text>
          <Text style={styles.cardMeaning}>{card.meaning}</Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    height: 240,
    perspective: 1000,
  },
  card: {
    width: 160,
    height: 240,
    borderRadius: 12,
    backfaceVisibility: 'hidden',
    position: 'absolute',
  },
  cardBack: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: Colors.deepNebula,
    borderWidth: 2,
    borderColor: Colors.starGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBackText: { fontSize: 48, color: Colors.starGold },
  cardBackSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 8 },
  cardFront: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    justifyContent: 'center',
  },
  cardName: { fontSize: 16, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center' },
  cardArcana: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 4 },
  cardMeaning: { fontSize: 13, color: Colors.textPrimary, textAlign: 'center', marginTop: 12, lineHeight: 20 },
});
