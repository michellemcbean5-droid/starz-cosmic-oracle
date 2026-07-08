import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../constants/colors';
import { useAuthStore } from '../stores/useAuthStore';

export const PromoCodeInput: React.FC = () => {
  const [code, setCode] = React.useState('');
  const [result, setResult] = React.useState<{ success: boolean; message: string } | null>(null);
  const applyPromoCode = useAuthStore((s) => s.applyPromoCode);
  const applyMasterCode = useAuthStore((s) => s.applyMasterCode);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    
    // Check if it's a master code first
    let res = await applyMasterCode(code.trim());
    if (!res.success) {
      res = await applyPromoCode(code.trim());
    }
    setResult(res);
    if (res.success) setCode('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🎁 Have a Promo Code?</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Enter code"
          placeholderTextColor={Colors.textMuted}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      {result && (
        <Text style={[styles.result, result.success ? styles.success : styles.error]}>
          {result.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.starGold, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buttonText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 14 },
  result: { marginTop: 8, fontSize: 13 },
  success: { color: Colors.success },
  error: { color: Colors.error },
});
