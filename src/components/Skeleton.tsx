import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

export const HoroscopeSkeleton: React.FC = () => (
  <View style={styles.container}>
    <Skeleton width={120} height={24} borderRadius={12} style={styles.center} />
    <Skeleton width={200} height={16} borderRadius={8} style={[styles.center, styles.marginTop]} />
    <Skeleton width="100%" height={80} borderRadius={12} style={styles.marginTop} />
    <Skeleton width="100%" height={60} borderRadius={12} style={styles.marginTop} />
    <Skeleton width="100%" height={60} borderRadius={12} style={styles.marginTop} />
    <View style={styles.row}>
      <Skeleton width="30%" height={50} borderRadius={8} />
      <Skeleton width="30%" height={50} borderRadius={8} />
      <Skeleton width="30%" height={50} borderRadius={8} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  container: {
    padding: 16,
  },
  center: {
    alignSelf: 'center',
  },
  marginTop: {
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
