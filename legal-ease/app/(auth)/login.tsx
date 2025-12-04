// Login screen - simple OTP authentication

import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const { sendOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);

  // Send OTP to email
  async function handleSendOtp() {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);
    const { error } = await sendOtp(email.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setStep('code');
      Alert.alert('Success', 'Check your email for the code');
    }
  }

  // Verify OTP code
  async function handleVerifyOtp() {
    if (!code.trim()) {
      Alert.alert('Error', 'Please enter the code');
      return;
    }

    setLoading(true);
    const { error } = await verifyOtp(email, code.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    }
    // Navigation happens automatically in _layout.tsx
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logo}>
          <Ionicons name="briefcase" size={64} color="#2563eb" />
          <Text style={styles.appName}>LegalEase</Text>
          <Text style={styles.tagline}>Legal Practice Management</Text>
        </View>

        {/* Email Step */}
        {step === 'email' && (
          <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="lawyer@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <Pressable
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Sending...' : 'Send Login Code'}
              </Text>
            </Pressable>

            <Text style={styles.hint}>
              We'll send you a one-time code to sign in
            </Text>
          </View>
        )}

        {/* Code Step */}
        {step === 'code' && (
          <View style={styles.form}>
            <Text style={styles.label}>Enter Code</Text>
            <Text style={styles.subtitle}>Sent to {email}</Text>

            <TextInput
              style={styles.input}
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />

            <Pressable
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </Pressable>

            <Pressable onPress={() => setStep('email')}>
              <Text style={styles.link}>Use different email</Text>
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { alignItems: 'center', marginBottom: 48 },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#2563eb', marginTop: 16 },
  tagline: { fontSize: 14, color: '#666', marginTop: 4 },
  form: { backgroundColor: 'white', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: '#e5e5e5' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  subtitle: { color: '#666', marginBottom: 16 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  hint: { textAlign: 'center', color: '#999', marginTop: 16, fontSize: 13 },
  link: { textAlign: 'center', color: '#2563eb', marginTop: 16, fontSize: 14 },
});
