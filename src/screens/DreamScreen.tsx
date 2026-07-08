import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { StarfieldBackground, CosmicCard } from '../components';
import { Colors } from '../constants/colors';
import { interpretDream, analyzeSentiment } from '../api/ai';
import { useAuthStore } from '../stores/useAuthStore';
import { useHistoryStore } from '../stores/useHistoryStore';
import { DreamInterpretation } from '../types';

export const DreamScreen: React.FC = () => {
  const canRead = useAuthStore((s) => s.canRead);
  const incrementReading = useAuthStore((s) => s.incrementReadingCount);
  const addReading = useHistoryStore((s) => s.addReading);
  const addDream = useHistoryStore((s) => s.addDream);

  const [dream, setDream] = useState('');
  const [result, setResult] = useState<DreamInterpretation | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState<{ label: string; score: number } | null>(null);

  const handleInterpret = async () => {
    if (!canRead() || !dream.trim()) return;
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const [interpretation, sentimentResult] = await Promise.all([
      interpretDream(dream.trim()),
      analyzeSentiment(dream.trim()),
    ]);

    const dreamResult: DreamInterpretation = {
      id: `dream-${Date.now()}`,
      dream: dream.trim(),
      interpretation,
      symbols: extractSymbols(dream.trim()),
      date: new Date().toISOString().split('T')[0],
    };

    setResult(dreamResult);
    setSentiment(sentimentResult);
    await addDream(dreamResult);
    await incrementReading();
    await addReading({
      type: 'dream',
      title: 'Dream Interpretation',
      date: dreamResult.date,
      preview: dreamResult.interpretation.substring(0, 100) + '...',
    });
    setLoading(false);
  };

  const handleShare = async () => {
    if (!result) return;
    await Share.share({
      message: `🌙 Dream Interpretation 🌙\n\nDream: ${result.dream}\n\n${result.interpretation}\n\nvia Starz Cosmic Oracle`,
    });
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🌙 Dream Oracle</Text>
          <Text style={styles.subtitle}>Unlock the secrets of your subconscious</Text>

          <CosmicCard style={styles.formCard}>
            <Text style={styles.label}>Describe Your Dream</Text>
            <TextInput
              style={styles.input}
              value={dream}
              onChangeText={setDream}
              placeholder="I was flying over a golden ocean..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.btn, (!dream.trim() || loading) && styles.btnDisabled]}
              onPress={handleInterpret}
              disabled={!dream.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.textPrimary} />
              ) : (
                <Text style={styles.btnText}>🔮 Interpret Dream</Text>
              )}
            </TouchableOpacity>
          </CosmicCard>

          {result && (
            <>
              <CosmicCard style={styles.resultCard}>
                <Text style={styles.resultTitle}>Dream Interpretation</Text>
                <Text style={styles.dreamText}>"{result.dream}"</Text>
                <Text style={styles.interpretation}>{result.interpretation}</Text>

                {sentiment && (
                  <View style={styles.sentimentRow}>
                    <Text style={styles.sentimentLabel}>Dream Mood:</Text>
                    <Text style={[styles.sentimentValue, sentiment.label === 'POSITIVE' ? styles.positive : styles.negative]}>
                      {sentiment.label} ({Math.round(sentiment.score * 100)}%)
                    </Text>
                  </View>
                )}

                <Text style={styles.symbolsTitle}>🔮 Key Symbols</Text>
                <View style={styles.symbolsRow}>
                  {result.symbols.map((symbol, i) => (
                    <View key={i} style={styles.symbolBadge}>
                      <Text style={styles.symbolText}>{symbol}</Text>
                    </View>
                  ))}
                </View>
              </CosmicCard>

              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Text style={styles.shareText}>📤 Share Interpretation</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

function extractSymbols(dream: string): string[] {
  const commonSymbols = ['water', 'fire', 'flying', 'falling', 'ocean', 'mountain', 'moon', 'sun', 'star', 'door', 'key', 'snake', 'bird', 'cat', 'dog', 'tree', 'flower', 'gold', 'silver', 'darkness', 'light', 'bridge', 'road', 'house', 'child', 'friend', 'stranger', 'angel', 'demon'];
  const found = commonSymbols.filter(s => dream.toLowerCase().includes(s));
  return found.length > 0 ? found : ['mystery', 'journey', 'transformation'];
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cosmicBlack },
  safeArea: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  formCard: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: Colors.starGold, marginBottom: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.cardBorder, textAlignVertical: 'top', minHeight: 120, fontSize: 14, lineHeight: 20 },
  btn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)' },
  btnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  resultCard: { marginBottom: 16 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold, marginBottom: 12 },
  dreamText: { fontSize: 14, color: Colors.textSecondary, fontStyle: 'italic', marginBottom: 12, lineHeight: 20 },
  interpretation: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },
  sentimentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.cardBorder },
  sentimentLabel: { fontSize: 13, color: Colors.textSecondary, marginRight: 8 },
  sentimentValue: { fontSize: 13, fontWeight: 'bold' },
  positive: { color: Colors.success },
  negative: { color: Colors.error },
  symbolsTitle: { fontSize: 14, fontWeight: '600', color: Colors.starGold, marginTop: 16, marginBottom: 8 },
  symbolsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symbolBadge: { backgroundColor: 'rgba(255,215,0,0.1)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.starGoldDark },
  symbolText: { fontSize: 12, color: Colors.starGold },
  shareBtn: { backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.starGoldDark, marginBottom: 24 },
  shareText: { color: Colors.starGold, fontWeight: '600' },
});
