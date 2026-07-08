import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StarfieldBackground, CosmicCard, ZodiacIcon } from '../components';
import { Colors } from '../constants/colors';
import { ZODIAC_SIGNS } from '../constants/astrology';
import { HoroscopeReading, ZodiacSign } from '../types';
import { fetchDailyHoroscope } from '../api/horoscope';
import { useAuthStore } from '../stores/useAuthStore';
import { useHistoryStore } from '../stores/useHistoryStore';

export const HomeScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const canRead = useAuthStore((s) => s.canRead);
  const incrementReading = useAuthStore((s) => s.incrementReadingCount);
  const addReading = useHistoryStore((s) => s.addReading);
  const [horoscope, setHoroscope] = useState<HoroscopeReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>('Aries');

  useEffect(() => {
    if (user?.sunSign) setSelectedSign(user.sunSign);
  }, [user]);

  const loadHoroscope = async (sign: ZodiacSign) => {
    if (!canRead()) return;
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const reading = await fetchDailyHoroscope(sign);
    setHoroscope(reading);
    await incrementReading();
    await addReading({
      type: 'horoscope',
      title: `${sign} Daily Horoscope`,
      date: reading.date,
      preview: reading.overview,
    });
    setLoading(false);
  };

  const handleShare = async () => {
    if (!horoscope) return;
    await Share.share({
      message: `✨ ${horoscope.sign} Daily Horoscope ✨

${horoscope.overview}

Mood: ${horoscope.mood}
Lucky Number: ${horoscope.luckyNumber}
Lucky Color: ${horoscope.luckyColor}

via Starz Cosmic Oracle`,
    });
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Starz Cosmic Oracle</Text>
          <Text style={styles.subtitle}>Your daily cosmic guidance</Text>

          <View style={styles.signRow}>
            {ZODIAC_SIGNS.map((sign) => (
              <TouchableOpacity
                key={sign}
                onPress={() => { setSelectedSign(sign); loadHoroscope(sign); }}
                style={[styles.signBtn, selectedSign === sign && styles.signBtnActive]}
              >
                <ZodiacIcon sign={sign} size={36} showElement={false} />
              </TouchableOpacity>
            ))}
          </View>

          {horoscope && (
            <CosmicCard style={styles.horoscopeCard}>
              <View style={styles.horoscopeHeader}>
                <ZodiacIcon sign={horoscope.sign} size={56} />
                <View style={styles.horoscopeMeta}>
                  <Text style={styles.horoscopeSign}>{horoscope.sign}</Text>
                  <Text style={styles.horoscopeDate}>{horoscope.date}</Text>
                </View>
              </View>

              <Text style={styles.overview}>{horoscope.overview}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💕 Love</Text>
                <Text style={styles.sectionText}>{horoscope.love}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💼 Career</Text>
                <Text style={styles.sectionText}>{horoscope.career}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🌿 Health</Text>
                <Text style={styles.sectionText}>{horoscope.health}</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Mood</Text>
                  <Text style={styles.statValue}>{horoscope.mood}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Lucky Number</Text>
                  <Text style={styles.statValue}>{horoscope.luckyNumber}</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Lucky Color</Text>
                  <Text style={styles.statValue}>{horoscope.luckyColor}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Text style={styles.shareText}>📤 Share Reading</Text>
              </TouchableOpacity>
            </CosmicCard>
          )}

          {!horoscope && !loading && (
            <CosmicCard style={styles.placeholder}>
              <Text style={styles.placeholderText}>Select your sign above to receive today's cosmic guidance.✨</Text>
            </CosmicCard>
          )}

          {loading && <Text style={styles.loading}>The stars are aligning...</Text>}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cosmicBlack },
  safeArea: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  signRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 16 },
  signBtn: { padding: 4, borderRadius: 999, borderWidth: 1, borderColor: 'transparent' },
  signBtnActive: { borderColor: Colors.starGold, backgroundColor: 'rgba(255,215,0,0.1)' },
  horoscopeCard: { marginBottom: 24 },
  horoscopeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  horoscopeMeta: { marginLeft: 12 },
  horoscopeSign: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary },
  horoscopeDate: { fontSize: 13, color: Colors.textSecondary },
  overview: { fontSize: 15, color: Colors.textPrimary, lineHeight: 22, marginBottom: 16, fontStyle: 'italic' },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.starGold, marginBottom: 4 },
  sectionText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.cardBorder },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  shareBtn: { marginTop: 16, backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.starGoldDark },
  shareText: { color: Colors.starGold, fontWeight: '600' },
  placeholder: { padding: 24, alignItems: 'center', marginTop: 40 },
  placeholderText: { color: Colors.textSecondary, textAlign: 'center', fontSize: 14 },
  loading: { color: Colors.starGold, textAlign: 'center', marginTop: 40, fontSize: 16 },
});
