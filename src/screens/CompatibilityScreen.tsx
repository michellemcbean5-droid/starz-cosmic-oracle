import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { StarfieldBackground, CosmicCard, ZodiacIcon } from '../components';
import { Colors } from '../constants/colors';
import { ZODIAC_SIGNS } from '../constants/astrology';
import { ZodiacSign, CompatibilityResult } from '../types';
import { analyzeCompatibility } from '../api/ai';
import { useAuthStore } from '../stores/useAuthStore';
import { useHistoryStore } from '../stores/useHistoryStore';

export const CompatibilityScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const canRead = useAuthStore((s) => s.canRead);
  const incrementReading = useAuthStore((s) => s.incrementReadingCount);
  const addReading = useHistoryStore((s) => s.addReading);
  const addCompatibility = useHistoryStore((s) => s.addCompatibility);

  const [sign1, setSign1] = useState<ZodiacSign>(user?.sunSign || 'Aries');
  const [sign2, setSign2] = useState<ZodiacSign>('Taurus');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleAnalyze = async () => {
    if (!canRead()) return;
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Calculate compatibility score deterministically
    const score = calculateCompatibilityScore(sign1, sign2);
    const description = getCompatibilityDescription(sign1, sign2, score);
    const aiAnalysis = await analyzeCompatibility(sign1, sign2);

    const compResult: CompatibilityResult = {
      sign1,
      sign2,
      score,
      description,
      aiAnalysis,
    };

    setResult(compResult);
    await addCompatibility(compResult);
    await incrementReading();
    await addReading({
      type: 'compatibility',
      title: `${sign1} + ${sign2} Compatibility`,
      date: new Date().toISOString().split('T')[0],
      preview: description,
    });
    setLoading(false);
  };

  const handleShare = async () => {
    if (!result) return;
    await Share.share({
      message: `💕 ${result.sign1} + ${result.sign2} Compatibility 💕\n\nScore: ${result.score}/100\n\n${result.description}\n\nvia Starz Cosmic Oracle`,
    });
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>💕 Compatibility</Text>
          <Text style={styles.subtitle}>Discover cosmic connections</Text>

          {step === 1 && (
            <CosmicCard style={styles.formCard}>
              <Text style={styles.label}>Your Sign</Text>
              <View style={styles.signGrid}>
                {ZODIAC_SIGNS.map((sign) => (
                  <TouchableOpacity
                    key={sign}
                    onPress={() => setSign1(sign)}
                    style={[styles.signBtn, sign1 === sign && styles.signBtnActive]}
                  >
                    <ZodiacIcon sign={sign} size={40} showElement={false} />
                    <Text style={styles.signLabel}>{sign}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
                <Text style={styles.nextBtnText}>Next →</Text>
              </TouchableOpacity>
            </CosmicCard>
          )}

          {step === 2 && (
            <CosmicCard style={styles.formCard}>
              <Text style={styles.label}>Their Sign</Text>
              <View style={styles.signGrid}>
                {ZODIAC_SIGNS.map((sign) => (
                  <TouchableOpacity
                    key={sign}
                    onPress={() => setSign2(sign)}
                    style={[styles.signBtn, sign2 === sign && styles.signBtnActive]}
                  >
                    <ZodiacIcon sign={sign} size={40} showElement={false} />
                    <Text style={styles.signLabel}>{sign}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                  <Text style={styles.backBtnText}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={Colors.textPrimary} />
                  ) : (
                    <Text style={styles.analyzeBtnText}>Analyze ✨</Text>
                  )}
                </TouchableOpacity>
              </View>
            </CosmicCard>
          )}

          {result && (
            <>
              <CosmicCard style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <ZodiacIcon sign={result.sign1} size={48} />
                  <Text style={styles.heart}>💕</Text>
                  <ZodiacIcon sign={result.sign2} size={48} />
                </View>
                <View style={styles.scoreBar}>
                  <View style={[styles.scoreFill, { width: `${result.score}%` }]} />
                </View>
                <Text style={styles.scoreText}>{result.score}/100 Compatibility</Text>
                <Text style={styles.description}>{result.description}</Text>
                {result.aiAnalysis && (
                  <View style={styles.aiSection}>
                    <Text style={styles.aiLabel}>🤖 AI Cosmic Analysis</Text>
                    <Text style={styles.aiText}>{result.aiAnalysis}</Text>
                  </View>
                )}
              </CosmicCard>

              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Text style={styles.shareText}>📤 Share Result</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

function calculateCompatibilityScore(sign1: ZodiacSign, sign2: ZodiacSign): number {
  const elements: Record<ZodiacSign, string> = {
    Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
    Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
    Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
  };
  const e1 = elements[sign1];
  const e2 = elements[sign2];
  if (e1 === e2) return 85 + Math.floor(Math.random() * 15);
  const compatible = { Fire: ['Air'], Air: ['Fire', 'Water'], Water: ['Earth', 'Air'], Earth: ['Water', 'Fire'] };
  if (compatible[e1]?.includes(e2)) return 70 + Math.floor(Math.random() * 25);
  return 45 + Math.floor(Math.random() * 30);
}

function getCompatibilityDescription(sign1: ZodiacSign, sign2: ZodiacSign, score: number): string {
  if (score >= 85) return `${sign1} and ${sign2} share a powerful cosmic bond. Your energies align naturally, creating harmony and deep understanding.`;
  if (score >= 70) return `${sign1} and ${sign2} complement each other well. With mutual respect, this connection can grow into something beautiful.`;
  if (score >= 50) return `${sign1} and ${sign2} have an interesting dynamic. Differences can be strengths if you embrace each other's uniqueness.`;
  return `${sign1} and ${sign2} face cosmic challenges. But remember — the universe often brings together opposites to teach important lessons.`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cosmicBlack },
  safeArea: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  formCard: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: Colors.starGold, marginBottom: 12 },
  signGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  signBtn: { alignItems: 'center', padding: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', margin: 4, minWidth: 70 },
  signBtnActive: { backgroundColor: 'rgba(255,215,0,0.15)', borderWidth: 1, borderColor: Colors.starGold },
  signLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  nextBtn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  nextBtnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  backBtn: { flex: 1, marginRight: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 14, alignItems: 'center' },
  backBtnText: { color: Colors.textSecondary, fontWeight: '600' },
  analyzeBtn: { flex: 2, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  analyzeBtnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  resultCard: { marginBottom: 16 },
  resultHeader: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  heart: { fontSize: 24, marginHorizontal: 16 },
  scoreBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, marginBottom: 8 },
  scoreFill: { height: '100%', backgroundColor: Colors.starGold, borderRadius: 4 },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center', marginBottom: 12 },
  description: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22, textAlign: 'center' },
  aiSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.cardBorder },
  aiLabel: { fontSize: 13, fontWeight: '600', color: Colors.info, marginBottom: 8 },
  aiText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, fontStyle: 'italic' },
  shareBtn: { backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.starGoldDark, marginBottom: 24 },
  shareText: { color: Colors.starGold, fontWeight: '600' },
});
