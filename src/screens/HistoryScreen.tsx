import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarfieldBackground, CosmicCard } from '../components';
import { Colors } from '../constants/colors';
import { useHistoryStore } from '../stores/useHistoryStore';

const typeEmojis: Record<string, string> = {
  horoscope: '✨',
  tarot: '🔮',
  birthchart: '🌌',
  moon: '🌙',
};

export const HistoryScreen: React.FC = () => {
  const history = useHistoryStore((s) => s.history);
  const loadHistory = useHistoryStore((s) => s.loadHistory);
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  useEffect(() => {
    loadHistory();
  }, []);

  const renderItem = ({ item }: { item: typeof history[0] }) => (
    <CosmicCard style={styles.itemCard}>
      <View style={styles.itemRow}>
        <Text style={styles.itemEmoji}>{typeEmojis[item.type] || '✨'}</Text>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDate}>{item.date}</Text>
          <Text style={styles.itemPreview} numberOfLines={2}>{item.preview}</Text>
        </View>
      </View>
    </CosmicCard>
  );

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>📜 History</Text>
        <Text style={styles.subtitle}>Your past cosmic readings</Text>

        {history.length > 0 ? (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
                <Text style={styles.clearText}>Clear History</Text>
              </TouchableOpacity>
            }
          />
        ) : (
          <CosmicCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No readings yet. Start your cosmic journey today!</Text>
          </CosmicCard>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cosmicBlack },
  safeArea: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  list: { paddingBottom: 24 },
  itemCard: { marginBottom: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start' },
  itemEmoji: { fontSize: 24, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  itemDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  itemPreview: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  clearBtn: { marginTop: 16, alignItems: 'center', padding: 12 },
  clearText: { color: Colors.error, fontSize: 14 },
  emptyCard: { padding: 32, alignItems: 'center', marginTop: 40 },
  emptyText: { color: Colors.textSecondary, textAlign: 'center', fontSize: 14 },
});
