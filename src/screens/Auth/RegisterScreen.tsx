import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform, StatusBar, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props { navigation: NavProp }

interface Field {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

const EMPTY: Field = { fullName: '', email: '', phone: '', password: '' };

function InputField({
  icon, placeholder, value, onChangeText,
  secureTextEntry, keyboardType, maxLength,
}: {
  icon: string; placeholder: string; value: string;
  onChangeText: (v: string) => void; secureTextEntry?: boolean;
  keyboardType?: any; maxLength?: number;
}) {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);
  return (
    <View style={[f.wrap, { backgroundColor: colors.bgInput, borderColor: colors.borderInput }]}>
      <MaterialCommunityIcons name={icon as any} size={18} color={colors.textMuted} style={f.icon} />
      <TextInput
        style={[f.input, { color: colors.textSecondary }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !show}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShow(s => !s)}>
          <MaterialCommunityIcons name={show ? 'eye-off' : 'eye'} size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [fields, setFields] = useState<Field>(EMPTY);
  const [loading, setLoading] = useState(false);

  const set = useCallback((key: keyof Field) => (val: string) =>
    setFields(prev => ({ ...prev, [key]: val })), []);

  const handleRegister = useCallback(async () => {
    const { fullName, email, phone, password } = fields;
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.'); return;
    }
    if (phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Enter a valid 10-digit phone number.'); return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.'); return;
    }
    try {
      setLoading(true);
      await register({ fullName: fullName.trim(), email: email.trim().toLowerCase(), phone, password });
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [fields, register]);

  return (
    <KeyboardAvoidingView
      style={[s.root, { backgroundColor: colors.bgBase }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bgBase}
      />
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={[s.logoIcon, { backgroundColor: colors.bgCard }]}>
            <MaterialCommunityIcons name="currency-inr" size={32} color={colors.accent} />
          </View>
          <Text style={[s.logoText, { color: colors.textPrimary }]}>FinFlow</Text>
          <Text style={[s.tagline, { color: colors.textMuted }]}>Smart money. Zero friction.</Text>
        </View>

        {/* Card */}
        <View style={[s.card, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          <Text style={[s.heading, { color: colors.textPrimary }]}>Create Account</Text>
          <Text style={[s.sub, { color: colors.textMuted }]}>Fill in the details to get started</Text>

          <InputField icon="account-outline"  placeholder="Full Name"     value={fields.fullName} onChangeText={set('fullName')} />
          <InputField icon="email-outline"    placeholder="Email address"  value={fields.email}    onChangeText={set('email')} keyboardType="email-address" />
          <InputField icon="phone-outline"    placeholder="Phone number"   value={fields.phone}    onChangeText={set('phone')} keyboardType="phone-pad" maxLength={10} />
          <InputField icon="lock-outline"     placeholder="Password"       value={fields.password} onChangeText={set('password')} secureTextEntry />

          <Text style={[s.hint, { color: colors.textMuted }]}>
            Your wallet is auto-created after registration.
          </Text>

          <TouchableOpacity
            style={[s.btn, { backgroundColor: colors.accent }, loading && s.btnDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.accentFg} />
              : <Text style={[s.btnText, { color: colors.accentFg }]}>Create Account</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={[s.footerText, { color: colors.textMuted }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[s.footerLink, { color: colors.textLink }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Input field styles ─────────────────────────────────────────────────────
const f = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14, height: 52, marginBottom: 12,
  },
  icon:  { marginRight: 10 },
  input: { flex: 1, fontSize: 14, paddingVertical: 0 },
});

// ── Screen styles ──────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:    { flex: 1 },
  scroll:  { paddingHorizontal: 20 },
  logoWrap:{ alignItems: 'center', marginBottom: 32 },
  logoIcon:{ width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoText:{ fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  tagline: { fontSize: 13, marginTop: 4 },
  card:    { borderRadius: 20, padding: 24, borderWidth: 1 },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  sub:     { fontSize: 13, marginBottom: 24 },
  hint:    { fontSize: 12, marginBottom: 20, lineHeight: 18 },
  btn:     { borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  footer:  { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 13 },
  footerLink: { fontSize: 13, fontWeight: '700' },
});
