import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarfieldBackground, CosmicCard, ZodiacIcon } from '../components';
import { Colors } from '../constants/colors';
import { ZODIAC_SIGNS } from '../constants/astrology';
import { useAuthStore } from '../stores/useAuthStore';
import { requestNotificationPermissions, scheduleDailyHoroscope, cancelAllNotifications } from '../utils/notifications';
import { calculateSunSign } from '../utils/astroCalculations';
import { ZodiacSign } from '../types';

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [name, setName] = useState(user?.name || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [birthTime, setBirthTime] = useState(user?.birthTime || '');
  const [birthLocation, setBirthLocation] = useState(user?.birthLocation || '');
  const [notifications, setNotifications] = useState(user?.notificationsEnabled || false);
  const [sunSign, setSunSign] = useState<ZodiacSign | undefined>(user?.sunSign);

  const handleSave = async () => {
    let sign = user?.sunSign;
    if (birthDate) {
      try {
        sign = calculateSunSign(new Date(birthDate + 'T12:00'));
        setSunSign(sign);
      } catch {}
    }
    const updated = {
      ...(user || {}),
      name: name || 'Cosmic Seeker',
      birthDate,
      birthTime,
      birthLocation,
      sunSign: sign,
      notificationsEnabled: notifications,
    } as any;
    await setUser(updated);
    Alert.alert('Saved', 'Your cosmic profile has been updated.');
  };

  const toggleNotifications = async (value: boolean) => {
    setNotifications(value);
    if (value) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailyHoroscope(8);
      }
    } else {
      await cancelAllNotifications();
    }
  };

  return (
    <View style={styles.container}>
      <StarfieldBackground />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>👤 Your Profile</Text>

          <CosmicCard style={styles.profileCard}>
            <View style={styles.avatarRow}>
              {sunSign ? <ZodiacIcon sign={sunSign} size={64} /> : <Text style={styles.avatarPlaceholder}>✨</Text>}
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Cosmic Seeker'}</Text>
                <Text style={styles.profileDetail}>
                  {user?.subscription === 'pro' ? '👑 Pro' : user?.subscription === 'premium' ? '⭐ Premium' : '🔷 Free'}
                </Text>
                {sunSign && <Text style={styles.profileDetail}>☀️ {sunSign}</Text>}
              </View>
            </View>
          </CosmicCard>

          <CosmicCard style={styles.formCard}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Birth Date</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Birth Time</Text>
            <TextInput style={styles.input} value={birthTime} onChangeText={setBirthTime} placeholder="HH:MM" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Birth Location</Text>
            <TextInput style={styles.input} value={birthLocation} onChangeText={setBirthLocation} placeholder="City, Country" placeholderTextColor={Colors.textMuted} />

            <View style={styles.switchRow}>
              <Text style={styles.label}>Daily Notifications</Text>
              <Switch value={notifications} onValueChange={toggleNotifications} trackColor={{ false: '#333', true: Colors.primary }} thumbColor={notifications ? Colors.starGold : '#999'} />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Profile</Text>
            </TouchableOpacity>
          </CosmicCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cosmicBlack },
  safeArea: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.starGold, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  profileCard: { marginBottom: 16 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { fontSize: 48 },
  profileInfo: { marginLeft: 16 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: Colors.textPrimary },
  profileDetail: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  formCard: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.starGold, marginBottom: 12 },
  label: { fontSize: 13, color: Colors.textSecondary, marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.cardBorder },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  saveBtn: { marginTop: 20, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  saveBtnText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15 },
});
