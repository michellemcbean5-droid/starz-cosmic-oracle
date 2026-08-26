import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarfieldBackground, CosmicCard, ZodiacIcon, PlanetBadge } from '../components';
import { Colors } from '../constants/colors';
import { BirthChartData, PreciseChartResponse, AIReadingResponse } from '../types';
import { calculateBirthChart } from '../api/birthChart';
import { fetchPreciseChart, fetchAIReading } from '../api/ephemerisEngine';
import { useAuthStore } from '../stores/useAuthStore';
import { PLANETS } from '../constants/astrology';

export const BirthChartScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [birthDate, setBirthDate] = useState(user?.birthDate || '1990-01-01');
  const [birthTime, setBirthTime] = useState(user?.birthTime || '12:00');
  const [birthLocation, setBirthLocation] = useState(user?.birthLocation || '');
  const [chart, setChart] = useState<BirthChartData | null>(null);
  const [precise, setPrecise] = useState<PreciseChartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [usedEngine, setUsedEngine] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiReading, setAiReading] = useState<AIReadingResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const isPremium = user?.subscription === 'premium' || user?.subscription === 'pro';

  const parseBirthParts = () => {
    const [y, m, d] = birthDate.split('-').map(Number);
    const [hh, mm] = birthTime.split(':').map(Number);
    return { year: y, month: m, day: d, hour: hh || 12, minute: mm || 0 };
  };

  const handleCalculate = async () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Birth chart calculation requires Premium or Pro subscription.');
      return;
    }
    setLoading(true);
    setPrecise(null);
    setAiReading(null);

    // Always compute the fast local estimate first, so something shows immediately.
    const date = new Date(birthDate + 'T' + birthTime);
    const localResult = calculateBirthChart(date, birthTime, birthLocation);
    setChart(localResult);

    // Then try the precision Swiss Ephemeris engine (real houses, aspects,
    // Sabian symbols, Arabic Lots). Falls back silently if unreachable.
    const parts = parseBirthParts();
    const engineChart = await fetchPreciseChart({
      ...parts,
      city: birthLocation || undefined,
      name: user?.name,
    });
    if (engineChart) {
      setPrecise(engineChart);
      setUsedEngine(true);
    } else {
      setUsedEngine(false);
    }
    setLoading(false);
  };

  const handleAskOracle = async () => {
    setAiLoading(true);
    const parts = parseBirthParts();
    const result = await fetchAIReading(
      { ...parts, city: birthLocation || undefined, name: user?.name },
      question || undefined
    );
    setAiReading(result);
    setAiLoading(false);
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
            <Text style={styles.label}>Birth Location (city, country)</Text>
            <TextInput style={styles.input} value={birthLocation} onChangeText={setBirthLocation} placeholder="e.g. New York, USA" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.hint}>Tip: use a city from the engine's list for exact coordinates and precise houses/rising sign.</Text>

            <TouchableOpacity style={styles.btn} onPress={handleCalculate} disabled={loading}>
              {loading ? <ActivityIndicator color={Colors.textInverse} /> : (
                <Text style={styles.btnText}>{isPremium ? 'Calculate Chart' : '🔒 Premium Only'}</Text>
              )}
            </TouchableOpacity>
          </CosmicCard>

          {chart && (<>
            <CosmicCard style={styles.resultCard}>
              <View style={styles.badgeRow}>
                <Text style={styles.resultTitle}>Your Big Three</Text>
                <Text style={usedEngine ? styles.enginePill : styles.estimatePill}>
                  {usedEngine ? '✦ Swiss Ephemeris precision' : '≈ estimated'}
                </Text>
              </View>
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

            {!precise && (
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
            )}

            {!precise && (
              <CosmicCard style={styles.resultCard}>
                <Text style={styles.resultTitle}>Major Aspects</Text>
                {chart.aspects.map((aspect, i) => (
                  <Text key={i} style={styles.aspectText}>🔹 {aspect}</Text>
                ))}
              </CosmicCard>
            )}
          </>)}

          {precise && (<>
            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Who You Are</Text>
              <Text style={styles.readingText}>{precise.reading.core.sun}</Text>
              <Text style={styles.readingText}>{precise.reading.core.moon}</Text>
              <Text style={styles.readingText}>{precise.reading.core.rising}</Text>
            </CosmicCard>

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Exact Planetary Positions</Text>
              {precise.chart.bodies.map((b) => (
                <View key={b.name} style={styles.planetRow}>
                  <Text style={styles.glyph}>{b.glyph}</Text>
                  <Text style={styles.planetName}>{b.name}</Text>
                  <Text style={styles.planetDetail}>
                    {b.sign} {b.degree_str} · House {b.house ?? '—'}{b.retrograde ? ' · ℞' : ''}
                  </Text>
                </View>
              ))}
            </CosmicCard>

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>How Your Planets Talk To Each Other</Text>
              {precise.reading.aspects.map((a, i) => (
                <Text key={i} style={styles.aspectText}>🔹 {a.text} ({a.pair}, orb {a.orb}°)</Text>
              ))}
            </CosmicCard>

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Your Sabian Symbols</Text>
              <Text style={styles.hint}>Secret degree-symbols for your most personal points.</Text>
              {precise.reading.sabian.map((s, i) => (
                <View key={i} style={styles.sabianBlock}>
                  <Text style={styles.sabianLabel}>{s.point} — {s.sabian}</Text>
                  <Text style={styles.readingText}>"{s.symbol}"</Text>
                </View>
              ))}
            </CosmicCard>

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Your Arabic Lots</Text>
              <Text style={styles.hint}>Ancient hidden-fortune points, calculated from your chart.</Text>
              {precise.lots.map((l, i) => (
                <Text key={i} style={styles.readingText}>{precise.reading.lots[i]?.text}</Text>
              ))}
            </CosmicCard>

            {precise.reading.predictions && (
              <CosmicCard style={styles.resultCard}>
                <Text style={styles.resultTitle}>What The Sky's Doing To You Right Now</Text>
                {precise.reading.predictions.lines.map((l, i) => (
                  <Text key={i} style={styles.readingText}>• {l.text}</Text>
                ))}
              </CosmicCard>
            )}

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>✦ Ask The Oracle</Text>
              <Text style={styles.hint}>Get a full AI-written reading in easy slang, tailored to your chart.</Text>
              <TextInput
                style={styles.input}
                value={question}
                onChangeText={setQuestion}
                placeholder="e.g. What's my love life looking like this year?"
                placeholderTextColor={Colors.textMuted}
              />
              <TouchableOpacity style={[styles.btn, styles.btnAlt]} onPress={handleAskOracle} disabled={aiLoading}>
                {aiLoading ? <ActivityIndicator color={Colors.textPrimary} /> : (
                  <Text style={styles.btnText}>Channel My Reading</Text>
                )}
              </TouchableOpacity>
              {aiReading && aiReading.available && (
                <Text style={[styles.readingText, { marginTop: 12 }]}>{aiReading.text}</Text>
              )}
              {aiReading && !aiReading.available && (
                <Text style={[styles.hint, { marginTop: 12 }]}>{aiReading.reason}</Text>
              )}
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
  hint: { fontSize: 12, color: Colors.textMuted, marginTop: 6, fontStyle: 'italic' },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.cardBorder },
  btn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnAlt: { backgroundColor: Colors.secondary },
  btnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  resultCard: { marginBottom: 16 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold },
  enginePill: { fontSize: 11, color: Colors.success, backgroundColor: 'rgba(46,204,113,0.12)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden' },
  estimatePill: { fontSize: 11, color: Colors.textMuted, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, overflow: 'hidden' },
  bigThreeRow: { flexDirection: 'row', justifyContent: 'space-around' },
  bigThreeItem: { alignItems: 'center' },
  bigThreeLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },
  bigThreeValue: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 2 },
  planetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  glyph: { fontSize: 16, color: Colors.starGold, width: 22 },
  planetName: { fontSize: 14, color: Colors.textPrimary, marginLeft: 8, flex: 1, fontWeight: '600' },
  planetDetail: { fontSize: 12, color: Colors.textSecondary },
  aspectText: { fontSize: 13, color: Colors.textSecondary, paddingVertical: 4 },
  readingText: { fontSize: 13, color: Colors.textSecondary, paddingVertical: 4, lineHeight: 19 },
  sabianBlock: { marginBottom: 10 },
  sabianLabel: { fontSize: 13, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 2 },
});
