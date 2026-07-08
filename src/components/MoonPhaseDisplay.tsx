import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoonPhase } from '../types';
import { Colors } from '../constants/colors';
import { CosmicCard } from './CosmicCard';

interface MoonPhaseDisplayProps {
  phase: MoonPhase;
}

export const MoonPhaseDisplay: React.FC<MoonPhaseDisplayProps> = ({ phase }) => {
  return (
    <CosmicCard style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{phase.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.phase}>{phase.phase}</Text>
          <Text style={styles.detail}>{phase.illumination}% illuminated · {phase.age} days old</Text>
        </View>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${phase.illumination}%` }]} />
      </View>
    </CosmicCard>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 48, marginRight: 16 },
  info: { flex: 1 },
  phase: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary },
  detail: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  barBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginTop: 12 },
  barFill: { height: '100%', backgroundColor: Colors.starGold, borderRadius: 3 },
});
