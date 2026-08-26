import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { StarfieldBackground, CosmicCard, TarotCardComponent } from '../components';
import { Colors } from '../constants/colors';
import { TarotReading } from '../types';
import { drawTarotCards } from '../api/tarot';
import { useAuthStore } from '../stores/useAuthStore';
import { useHistoryStore } from '../stores/useHistoryStore';

export const TarotScreen: React.FC = () => {
  const canRead = useAuthStore((s) => s.canRead);
  const incrementReading = useAuthStore((s) => s.incrementReadingCount);
  const addReading = useHistoryStore((s) => s.addReading);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDraw = async () => {
    if (!canRead()) return;
    setLoading(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const result = await drawTarotCards(3, question.trim() || undefined);
    setReading(result);
    await incrementReading();
    await addReading({
      type: 'tarot',
      title: 'Tarot Reading',
      date: result.date,
      preview: result.cards.map((c) => c.name).join(', '),
    });
    setLoading(false);
  };

  const handleShare = async () => {
    if (!reading) return;
    await Share.share({
      message: `🔮 My Tarot Reading 🔮

Question: ${reading.question}

Cards: ${reading.cards.map((c) => c.name).join(', ')}

${reading.interpretation}

via Starz Cosmic Oracle`,
    });
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🔮 Tarot Reading</Text>
          <Text style={styles.subtitle}>Ask the cosmic cards</Text>

          <CosmicCard style={styles.formCard}>
            <Text style={styles.label}>Your Question (optional)</Text>
            <TextInput
              style={styles.input}
              value={question}
              onChangeText={setQuestion}
              placeholder="What does the universe want me to know?"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.btn} onPress={handleDraw} disabled={loading}>
              <Text style={styles.btnText}>{loading ? 'Shuffling...' : 'Draw 3 Cards'}</Text>
            </TouchableOpacity>
          </CosmicCard>

          {reading && (
            <>
              <View style={styles.cardsRow}>
                {reading.cards.map((card, i) => (
                  <TarotCardComponent key={card.id} card={card} index={i} revealed={false} />
                ))}
              </View>

              <CosmicCard style={styles.interpretationCard}>
                <Text style={styles.interpretationTitle}>Interpretation</Text>
                <Text style={styles.interpretationText}>{reading.interpretation}</Text>
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                  <Text style={styles.shareText}>📤 Share Reading</Text>
                </TouchableOpacity>
              </CosmicCard>
            </>
          )}
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
  label: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.cardBorder, textAlignVertical: 'top', minHeight: 80 },
  btn: { marginTop: 16, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  interpretationCard: { marginBottom: 24 },
  interpretationTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold, marginBottom: 12 },
  interpretationText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  shareBtn: { marginTop: 16, backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.starGoldDark },
  shareText: { color: Colors.starGold, fontWeight: '600' },
});
