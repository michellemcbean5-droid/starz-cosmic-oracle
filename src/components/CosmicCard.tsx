import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/colors';

interface CosmicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
}

export const CosmicCard: React.FC<CosmicCardProps> = ({ children, style, gradient = true }) => {
  return (
    <View style={[styles.container, style]}>
      {gradient ? (
        <LinearGradient
          colors={['rgba(26, 10, 46, 0.9)', 'rgba(13, 27, 62, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
      )}
      <View style={styles.border} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  content: {
    padding: 16,
    zIndex: 1,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.starGold,
    opacity: 0.6,
  },
});
