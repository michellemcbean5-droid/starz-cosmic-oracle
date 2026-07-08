import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { StarfieldBackground, CosmicCard } from '../components';
import { Colors } from '../constants/colors';
import { analyzeNumerology, generateLocalFortune } from '../api/ai';
import { useAuthStore } from '../stores/useAuthStore';
import { useHistoryStore } from '../stores/useHistoryStore';
import { NumerologyReading } from '../types';

export const NumerologyScreen: React.FC = () => {
  const canRead = useAuthStore((s) => s.canRead);
  const incrementReading = useAuthStore((s) => s.incrementReadingCount);
  const addReading = useHistoryStore((s) => s.addReading);
  const addNumerology = useHistoryStore((s) => s.addNumerology);

  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<NumerologyReading | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!canRead()) return;
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let num = parseInt(number);
    if (isNaN(num) && birthDate) {
      num = calculateLifePathNumber(birthDate);
    }
    if (isNaN(num)) num = 7;

    const [meaning, aiInsight] = await Promise.all([
      analyzeNumerology(num),
      Promise.resolve(generateLocalFortune(name || 'Seeker', num)),
    ]);

    const reading: NumerologyReading = {
      number: num,
      meaning,
      lifePathNumber: birthDate ? calculateLifePathNumber(birthDate) : undefined,
      aiInsight,
    };

    setResult(reading);
    await addNumerology(reading);
    await incrementReading();
    await addReading({
      type: 'numerology',
      title: `Numerology: ${num}`,
      date: new Date().toISOString().split('T')[0],
      preview: meaning,
    });
    setLoading(false);
  };

  const handleShare = async () => {
    if (!result) return;
    await Share.share({
      message: `🔢 Numerology Reading 🔢\n\nNumber: ${result.number}\n\n${result.meaning}\n${result.aiInsight ? '\n' + result.aiInsight : ''}\n\nvia Starz Cosmic Oracle`,
    });
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🔢 Numerology</Text>
          <Text style={styles.subtitle}>Discover your cosmic numbers</Text>

          <CosmicCard style={styles.formCard}>
            <Text style={styles.label}>Your Name (optional)</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.label}>Birth Date (for Life Path)</Text>
            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.label}>Or Enter a Number</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber}
              placeholder="7, 11, 22..."
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleCalculate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>✨ Calculate</Text>
              )}
            </TouchableOpacity>
          </CosmicCard>

          {result && (
            <>
              <CosmicCard style={styles.resultCard}>
                <Text style={styles.numberDisplay}>{result.number}</Text>
                {result.lifePathNumber && (
                  <Text style={styles.lifePath}>Life Path Number: {result.lifePathNumber}</Text>
                )}
                <Text style={styles.meaning}>{result.meaning}</Text>
                {result.aiInsight && (
                  <View style={styles.aiSection}>
                    <Text style={styles.aiLabel}>🌟 Cosmic Fortune</Text>
                    <Text style={styles.aiText}>{result.aiInsight}</Text>
                  </View>
                )}
              </CosmicCard>

              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Text style={styles.shareText}>📤 Share Reading</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

function calculateLifePathNumber(dateStr: string): number {
  const digits = dateStr.replace(/\D/g, '').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cosmicBlack },
  safeArea: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  formCard: { marginBottom: 16 },
  label: { fontSize: 13, color: Colors.textSecondary, marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.cardBorder },
  btn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)' },
  btnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  resultCard: { marginBottom: 16, alignItems: 'center' },
  numberDisplay: { fontSize: 64, fontWeight: 'bold', color: Colors.starGold, marginBottom: 8 },
  lifePath: { fontSize: 14, color: Colors.info, marginBottom: 12 },
  meaning: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22, textAlign: 'center' },
  aiSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.cardBorder, width: '100%' },
  aiLabel: { fontSize: 13, fontWeight: '600', color: Colors.starGold, marginBottom: 8, textAlign: 'center' },
  aiText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, textAlign: 'center', fontStyle: 'italic' },
  shareBtn: { backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.starGoldDark, marginBottom: 24 },
  shareText: { color: Colors.starGold, fontWeight: '600' },
});
