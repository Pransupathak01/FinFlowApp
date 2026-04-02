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

type NavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props { navigation: NavProp }

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
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
      // Token stored → RootNavigator automatically switches to BottomTabs
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0B1120" />

      <View style={[s.inner, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }]}>
        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logoIcon}>
            <MaterialCommunityIcons name="currency-inr" size={36} color="#4F8EF7" />
          </View>
          <Text style={s.logoText}>FinFlow</Text>
          <Text style={s.tagline}>Smart money. Zero friction.</Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          <Text style={s.heading}>Welcome Back</Text>
          <Text style={s.sub}>Sign in to your account</Text>

          {/* Email */}
          <View style={s.field}>
            <MaterialCommunityIcons name="email-outline" size={18} color="#4A5568" style={s.fieldIcon} />
            <TextInput
              style={s.input}
              placeholder="Email address"
              placeholderTextColor="#4A5568"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Password */}
          <View style={s.field}>
            <MaterialCommunityIcons name="lock-outline" size={18} color="#4A5568" style={s.fieldIcon} />
            <TextInput
              style={s.input}
              placeholder="Password"
              placeholderTextColor="#4A5568"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPwd}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity onPress={() => setShowPwd(v => !v)}>
              <MaterialCommunityIcons name={showPwd ? 'eye-off' : 'eye'} size={18} color="#4A5568" />
            </TouchableOpacity>
          </View>

          {/* Forgot */}
          <TouchableOpacity style={s.forgot} activeOpacity={0.7}>
            <Text style={s.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign In */}
          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Sign In</Text>}
          </TouchableOpacity>
        </View>

        {/* Register link */}
        <View style={s.footer}>
          <Text style={s.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={s.footerLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0B1120' },
  inner:   { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoWrap:{ alignItems: 'center', marginBottom: 40 },
  logoIcon:{ width: 72, height: 72, borderRadius: 20, backgroundColor: '#111C2E', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  logoText:{ fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 },
  tagline: { fontSize: 13, color: '#4A5568', marginTop: 4 },
  card:    { backgroundColor: '#111C2E', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1A2640' },
  heading: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  sub:     { fontSize: 13, color: '#4A5568', marginBottom: 24 },
  field:   { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1120', borderRadius: 12, borderWidth: 1, borderColor: '#1A2640', paddingHorizontal: 14, height: 52, marginBottom: 12 },
  fieldIcon:{ marginRight: 10 },
  input:   { flex: 1, color: '#E2E8F0', fontSize: 14, paddingVertical: 0 },
  forgot:  { alignSelf: 'flex-end', marginBottom: 20, marginTop: 4 },
  forgotText: { fontSize: 12, color: '#4F8EF7', fontWeight: '600' },
  btn:     { backgroundColor: '#4F8EF7', borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  footer:  { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontSize: 13, color: '#4A5568' },
  footerLink: { fontSize: 13, color: '#4F8EF7', fontWeight: '700' },
});
