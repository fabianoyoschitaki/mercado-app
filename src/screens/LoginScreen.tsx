import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme';
import AppButton from '../../components/AppButton';
import Brand from '../../components/Brand';

export default function LoginScreen({ route }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      // on success the navigator swaps to the app; nothing to do here
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.brand}>
        <Brand size="lg" tagline />
      </View>
      {route.params?.reason === 'checkout' && (
        <Text style={styles.reason}>Log in to check out</Text>
      )}
      <Text style={styles.label}>Email</Text>
      <TextInput
        testID="email-input"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        testID="password-input"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error !== '' && (
        <Text testID="login-error" style={styles.error}>
          {error}
        </Text>
      )}
      <AppButton testID="login-button" title="Log In" onPress={onLogin} />
      {busy && <ActivityIndicator color={colors.primary} style={{ marginTop: 12 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    backgroundColor: colors.bg,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 32,
  },
  reason: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: 10,
    borderRadius: radius,
    marginBottom: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    marginBottom: 8,
  },
});
