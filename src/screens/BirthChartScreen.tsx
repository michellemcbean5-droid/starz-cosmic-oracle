import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarfieldBackground, CosmicCard, ZodiacIcon, PlanetBadge } from '../components';
import { Colors } from '../constants/colors';
import { BirthChartData } from '../types';
import { calculateBirthChart } from '../api/birthChart';
import { useAuthStore } from '../stores/useAuthStore';
import { PLANETS } from '../constants/astrology';

export const BirthChartScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [birthDate, setBirthDate] = useState(user?.birthDate || '1990-01-01');
  const [birthTime, setBirthTime] = useState(user?.birthTime || '12:00');
  const [birthLocation, setBirthLocation] = useState(user?.birthLocation || '');
  const [chart, setChart] = useState<BirthChartData | null>(null);

  const isPremium = user?.subscription === 'premium' || user?.subscription === 'pro';

  const handleCalculate = () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Birth chart calculation requires Premium or Pro subscription.');
      return;
    }
    const date = new Date(birthDate + 'T' + birthTime);
    const result = calculateBirthChart(date, birthTime, birthLocation);
    setChart(result);
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🌌 Birth Chart</Text>
          <Text style={styles.subtitle}>Calculate your natal chart</Text>

          <CosmicCard style={styles.formCard}>
            <Text style={styles.label}>Birth Date</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Birth Time</Text>
            <TextInput style={styles.input} value={birthTime} onChangeText={setBirthTime} placeholder="HH:MM" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Birth Location</Text>
            <TextInput style={styles.input} value={birthLocation} onChangeText={setBirthLocation} placeholder="City, Country" placeholderTextColor={Colors.textMuted} />

            <TouchableOpacity style={styles.btn} onPress={handleCalculate}>
              <Text style={styles.btnText}>{isPremium ? 'Calculate Chart' : '🔒 Premium Only'}</Text>
            </TouchableOpacity>
          </CosmicCard>

          {chart && (<>
            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Your Big Three</Text>
              <View style={styles.bigThreeRow}>
                <View style={styles.bigThreeItem}>
                  <ZodiacIcon sign={chart.sunSign} size={48} />
                  <Text style={styles.bigThreeLabel}>Sun</Text>
                  <Text style={styles.bigThreeValue}>{chart.sunSign}</Text>
                </View>
                <View style={styles.bigThreeItem}>
                  <ZodiacIcon sign={chart.moonSign} size={48} />
                  <Text style={styles.bigThreeLabel}>Moon</Text>
                  <Text style={styles.bigThreeValue}>{chart.moonSign}</Text>
                </View>
                <View style={styles.bigThreeItem}>
                  <ZodiacIcon sign={chart.risingSign} size={48} />
                  <Text style={styles.bigThreeLabel}>Rising</Text>
                  <Text style={styles.bigThreeValue}>{chart.risingSign}</Text>
                </View>
              </View>
            </CosmicCard>

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Planetary Positions</Text>
              {PLANETS.map((planet) => (
                <View key={planet} style={styles.planetRow}>
                  <PlanetBadge planet={planet} sign={chart.planetaryPositions[planet].sign} size="sm" />
                  <Text style={styles.planetName}>{planet}</Text>
                  <Text style={styles.planetDetail}>
                    {chart.planetaryPositions[planet].sign} · {chart.planetaryPositions[planet].degree}° · House {chart.planetaryPositions[planet].house}
                  </Text>
                </View>
              ))}
            </CosmicCard>

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Major Aspects</Text>
              {chart.aspects.map((aspect, i) => (
                <Text key={i} style={styles.aspectText}>🔹 {aspect}</Text>
              ))}
            </CosmicCard>
          </>)}
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
  formCard: { marginBottom: 16 },
  label: { fontSize: 13, color: Colors.textSecondary, marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.cardBorder },
  btn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  resultCard: { marginBottom: 16 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold, marginBottom: 12 },
  bigThreeRow: { flexDirection: 'row', justifyContent: 'space-around' },
  bigThreeItem: { alignItems: 'center' },
  bigThreeLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },
  bigThreeValue: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 2 },
  planetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  planetName: { fontSize: 14, color: Colors.textPrimary, marginLeft: 8, flex: 1, fontWeight: '600' },
  planetDetail: { fontSize: 12, color: Colors.textSecondary },
  aspectText: { fontSize: 13, color: Colors.textSecondary, paddingVertical: 4 },
});
