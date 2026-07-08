import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarfieldBackground, CosmicCard, MoonPhaseDisplay } from '../components';
import { Colors } from '../constants/colors';
import { MoonPhase } from '../types';
import { getCurrentMoonPhase, getMoonPhaseCalendar } from '../api/moon';

export const MoonScreen: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<MoonPhase | null>(null);
  const [calendar, setCalendar] = useState<{ date: string; phase: MoonPhase }[]>([]);
  const today = new Date();

  useEffect(() => {
    setCurrentPhase(getCurrentMoonPhase());
    setCalendar(getMoonPhaseCalendar(today.getFullYear(), today.getMonth()));
  }, []);

  const renderCalendarItem = ({ item }: { item: { date: string; phase: MoonPhase } }) => {
    const isToday = item.date === today.toISOString().split('T')[0];
    return (
      <View style={[styles.dayCell, isToday && styles.dayCellActive]}>
        <Text style={styles.dayEmoji}>{item.phase.emoji}</Text>
        <Text style={styles.dayNumber}>{parseInt(item.date.split('-')[2])}</Text>
        <Text style={styles.dayPhase}>{item.phase.phase}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🌙 Moon Phases</Text>
          <Text style={styles.subtitle}>Lunar cycle & cosmic timing</Text>

          {currentPhase && <MoonPhaseDisplay phase={currentPhase} />}

          <CosmicCard style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>
              {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <FlatList
              data={calendar}
              renderItem={renderCalendarItem}
              keyExtractor={(item) => item.date}
              numColumns={4}
              scrollEnabled={false}
              contentContainerStyle={styles.calendarGrid}
            />
          </CosmicCard>

          <CosmicCard style={styles.infoCard}>
            <Text style={styles.infoTitle}>🌕 Lunar Wisdom</Text>
            <Text style={styles.infoText}>
              • New Moon: Set intentions, plant seeds, begin new projects.{'
'}
              • Waxing Crescent: Take action, build momentum.{'
'}
              • First Quarter: Make decisions, overcome obstacles.{'
'}
              • Waxing Gibbous: Refine, adjust, prepare for culmination.{'
'}
              • Full Moon: Celebrate, release, manifest gratitude.{'
'}
              • Waning Gibbous: Share wisdom, teach, give back.{'
'}
              • Last Quarter: Let go, forgive, clear space.{'
'}
              • Waning Crescent: Rest, dream, renew your spirit.{'
'}
            </Text>
          </CosmicCard>
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
  calendarCard: { marginTop: 16, marginBottom: 16 },
  calendarTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  calendarGrid: { gap: 8 },
  dayCell: { flex: 1, alignItems: 'center', padding: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.03)', margin: 4 },
  dayCellActive: { borderWidth: 1, borderColor: Colors.starGold, backgroundColor: 'rgba(255,215,0,0.08)' },
  dayEmoji: { fontSize: 20 },
  dayNumber: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 2 },
  dayPhase: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  infoCard: { marginBottom: 24 },
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold, marginBottom: 12 },
  infoText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 22 },
});
