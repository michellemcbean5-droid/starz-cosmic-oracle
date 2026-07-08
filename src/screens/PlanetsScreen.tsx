import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarfieldBackground, CosmicCard, PlanetBadge } from '../components';
import { Colors } from '../constants/colors';
import { PlanetTransit } from '../types';
import { getCurrentTransits } from '../api/planets';
import { PLANET_COLORS } from '../constants/astrology';

export const PlanetsScreen: React.FC = () => {
  const [transits, setTransits] = useState<PlanetTransit[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetTransit | null>(null);

  useEffect(() => {
    setTransits(getCurrentTransits());
  }, []);

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>🪐 Planetary Transits</Text>
          <Text style={styles.subtitle}>Current cosmic weather</Text>

          <View style={styles.transitGrid}>
            {transits.map((transit) => (
              <TouchableOpacity
                key={transit.planet}
                onPress={() => setSelectedPlanet(transit)}
                style={[
                  styles.transitCard,
                  selectedPlanet?.planet === transit.planet && styles.transitCardActive,
                ]}
              >
                <PlanetBadge planet={transit.planet} sign={transit.sign} size="lg" isRetrograde={transit.isRetrograde} />
                <Text style={styles.planetName}>{transit.planet}</Text>
                <Text style={styles.planetSign}>{transit.sign}</Text>
                {transit.isRetrograde && <Text style={styles.retroBadge}>℞ Retrograde</Text>}
              </TouchableOpacity>
            ))}
          </View>

          {selectedPlanet && (
            <CosmicCard style={styles.detailCard}>
              <Text style={styles.detailTitle}>
                {selectedPlanet.planet} in {selectedPlanet.sign}
              </Text>
              <Text style={styles.detailDegree}>
                {selectedPlanet.degree}° {selectedPlanet.isRetrograde ? '(Retrograde)' : '(Direct)'}
              </Text>
              <Text style={styles.detailInfluence}>{selectedPlanet.influence}</Text>
            </CosmicCard>
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
  transitGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  transitCard: { width: '30%', alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'transparent' },
  transitCardActive: { borderColor: Colors.starGold, backgroundColor: 'rgba(255,215,0,0.08)' },
  planetName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginTop: 8 },
  planetSign: { fontSize: 12, color: Colors.textSecondary },
  retroBadge: { fontSize: 10, color: Colors.error, marginTop: 4 },
  detailCard: { marginTop: 16, marginBottom: 24 },
  detailTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold },
  detailDegree: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  detailInfluence: { fontSize: 14, color: Colors.textPrimary, marginTop: 12, lineHeight: 22, fontStyle: 'italic' },
});
