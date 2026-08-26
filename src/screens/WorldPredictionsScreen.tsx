import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarfieldBackground, CosmicCard } from '../components';
import { Colors } from '../constants/colors';
import { WorldForecast } from '../types';
import { fetchWorldForecast } from '../api/ephemerisEngine';

export const WorldPredictionsScreen: React.FC = () => {
  const [forecast, setForecast] = useState<WorldForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    const result = await fetchWorldForecast();
    if (result) setForecast(result);
    else setError(true);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🌍 World Predictions</Text>
          <Text style={styles.subtitle}>What the planets and stars say about the collective — not just you</Text>

          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={Colors.starGold} size="large" />
              <Text style={styles.hint}>Reading the sky for the world…</Text>
            </View>
          )}

          {!loading && error && (
            <CosmicCard style={styles.resultCard}>
              <Text style={styles.readingText}>
                Couldn't reach the astrology engine. World predictions need a live connection
                to the Starz Cosmic Oracle backend (Swiss Ephemeris server).
              </Text>
              <TouchableOpacity style={styles.btn} onPress={load}>
                <Text style={styles.btnText}>Try Again</Text>
              </TouchableOpacity>
            </CosmicCard>
          )}

          {!loading && forecast && (<>
            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>{forecast.year} Astrological Year</Text>
              <Text style={styles.hint}>
                Cast for the Aries Ingress — {forecast.aries_ingress.moment_utc} — over {forecast.aries_ingress.location}
              </Text>
              <Text style={styles.readingText}>
                World Rising Sign: {forecast.aries_ingress.ascendant.sign} {forecast.aries_ingress.ascendant.degree_str}
              </Text>
            </CosmicCard>

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Predictions For The World</Text>
              {forecast.predictions.map((p, i) => (
                <Text key={i} style={styles.readingText}>• {p}</Text>
              ))}
            </CosmicCard>

            <CosmicCard style={styles.resultCard}>
              <Text style={styles.resultTitle}>Current Sky (Right Now)</Text>
              {forecast.current_sky.map((b) => (
                <View key={b.name} style={styles.planetRow}>
                  <Text style={styles.glyph}>{b.glyph}</Text>
                  <Text style={styles.planetName}>{b.name}</Text>
                  <Text style={styles.planetDetail}>
                    {b.sign} {b.degree_str}{b.retrograde ? ' · ℞ retrograde' : ''}
                  </Text>
                </View>
              ))}
            </CosmicCard>

            <Text style={styles.disclaimer}>
              World predictions use classic mundane-astrology technique (the Aries Ingress
              chart + slow-planet aspects) for entertainment and reflection — not financial
              or political advice.
            </Text>
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
  subtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  loadingBox: { alignItems: 'center', paddingVertical: 40 },
  hint: { fontSize: 12, color: Colors.textMuted, marginTop: 8, fontStyle: 'italic' },
  resultCard: { marginBottom: 16 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold, marginBottom: 8 },
  readingText: { fontSize: 13, color: Colors.textSecondary, paddingVertical: 4, lineHeight: 19 },
  planetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  glyph: { fontSize: 16, color: Colors.starGold, width: 22 },
  planetName: { fontSize: 14, color: Colors.textPrimary, marginLeft: 8, flex: 1, fontWeight: '600' },
  planetDetail: { fontSize: 12, color: Colors.textSecondary },
  btn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  disclaimer: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginBottom: 24, fontStyle: 'italic' },
});
