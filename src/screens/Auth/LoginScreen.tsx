import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, StatusBar, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../store/AuthContext';
import { useTheme } from '../../store/ThemeContext';

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props { navigation: NavProp }

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.'); return;
    }
    try {
      setLoading(true);
      await login({ email: email.trim().toLowerCase(), password });
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  return (
    <KeyboardAvoidingView
      style={[s.root, { backgroundColor: colors.bgBase }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bgBase}
      />

      <View style={[s.inner, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }]}>
        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={[s.logoIcon, { backgroundColor: colors.bgCard }]}>
            <MaterialCommunityIcons name="currency-inr" size={36} color={colors.accent} />
          </View>
          <Text style={[s.logoText, { color: colors.textPrimary }]}>FinFlow</Text>
          <Text style={[s.tagline, { color: colors.textMuted }]}>Smart money. Zero friction.</Text>
        </View>

        {/* Card */}
        <View style={[s.card, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          <Text style={[s.heading, { color: colors.textPrimary }]}>Welcome Back</Text>
          <Text style={[s.sub, { color: colors.textMuted }]}>Sign in to your account</Text>

          {/* Email */}
          <View style={[s.field, { backgroundColor: colors.bgInput, borderColor: colors.borderInput }]}>
            <MaterialCommunityIcons name="email-outline" size={18} color={colors.textMuted} style={s.fieldIcon} />
            <TextInput
              style={[s.input, { color: colors.textSecondary }]}
              placeholder="Email address"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={[s.field, { backgroundColor: colors.bgInput, borderColor: colors.borderInput }]}>
            <MaterialCommunityIcons name="lock-outline" size={18} color={colors.textMuted} style={s.fieldIcon} />
            <TextInput
              style={[s.input, { color: colors.textSecondary }]}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPwd}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPwd(v => !v)}>
              <MaterialCommunityIcons name={showPwd ? 'eye-off' : 'eye'} size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <TouchableOpacity style={s.forgot} activeOpacity={0.7}>
            <Text style={[s.forgotText, { color: colors.textLink }]}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[s.btn, { backgroundColor: colors.accent }, loading && s.btnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.accentFg} />
              : <Text style={[s.btnText, { color: colors.accentFg }]}>Sign In</Text>}
          </TouchableOpacity>
        </View>

        {/* Register link */}
        <View style={s.footer}>
          <Text style={[s.footerText, { color: colors.textMuted }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[s.footerLink, { color: colors.textLink }]}>Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1 },
  inner:   { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoWrap:{ alignItems: 'center', marginBottom: 40 },
  logoIcon:{ width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoText:{ fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  tagline: { fontSize: 13, marginTop: 4 },
  card:    { borderRadius: 20, padding: 24, borderWidth: 1 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  sub:     { fontSize: 13, marginBottom: 24 },
  field:   { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 52, marginBottom: 12 },
  fieldIcon:{ marginRight: 10 },
  input:   { flex: 1, fontSize: 14, paddingVertical: 0 },
  forgot:  { alignSelf: 'flex-end', marginBottom: 20, marginTop: 4 },
  forgotText: { fontSize: 12, fontWeight: '600' },
  btn:     { borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  footer:  { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontSize: 13 },
  footerLink: { fontSize: 13, fontWeight: '700' },
});
