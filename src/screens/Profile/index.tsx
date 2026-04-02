import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, StatusBar, Modal, TextInput, ActivityIndicator,
  Alert, KeyboardAvoidingView, Platform, RefreshControl,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, ThemeMode } from '../../store/ThemeContext';
import { useAuth } from '../../store/AuthContext';

// ── Avatar initials helper ────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}


// ── Small Section header ──────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <Text style={[sh.text, { color: colors.textMuted }]}>{label}</Text>
  );
}
const sh = StyleSheet.create({ text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, marginTop: 20, paddingHorizontal: 4 } });

// ── Row item ─────────────────────────────────────────────────────────────
function RowItem({
  icon, label, value, onPress, right, danger,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[r.row, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !right}
    >
      <View style={[r.iconWrap, { backgroundColor: danger ? colors.failedBg : colors.bgMuted }]}>
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color={danger ? colors.failedFg : colors.accent}
        />
      </View>
      <View style={r.labelWrap}>
        <Text style={[r.label, { color: danger ? colors.failedFg : colors.textPrimary }]}>{label}</Text>
        {value ? <Text style={[r.value, { color: colors.textMuted }]}>{value}</Text> : null}
      </View>
      {right ?? (
        onPress
          ? <MaterialCommunityIcons name="chevron-right" size={18} color={colors.textMuted} />
          : null
      )}
    </TouchableOpacity>
  );
}
const r = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8, gap: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  labelWrap:{ flex: 1 },
  label:    { fontSize: 14, fontWeight: '600' },
  value:    { fontSize: 12, marginTop: 1 },
});

// ── Edit Profile Modal ────────────────────────────────────────────────────
interface EditField {
  fullName: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  city: string;
}


function EditProfileModal({
  visible, initial, onClose, onSave, saving,
}: {
  visible: boolean;
  initial: EditField;
  onClose: () => void;
  onSave:  (f: EditField) => void;
  saving:  boolean;
}) {
  const { colors } = useTheme();
  const [fields, setFields] = useState<EditField>(initial);

  const set = (key: keyof EditField) => (val: string) =>
    setFields(prev => ({ ...prev, [key]: val }));

  useEffect(() => {
    if (visible) setFields(initial);
  }, [visible, initial]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={m.overlay}
      >
        <ScrollView contentContainerStyle={m.scroll}>
          <View style={[m.sheet, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
            <View style={[m.handle, { backgroundColor: colors.bgMuted }]} />
            <Text style={[m.title, { color: colors.textPrimary }]}>Edit Profile</Text>

            <Text style={[m.label, { color: colors.textMuted }]}>Full Name</Text>
            <View style={[m.field, { backgroundColor: colors.bgInput, borderColor: colors.borderInput }]}>
              <MaterialCommunityIcons name="account-outline" size={16} color={colors.textMuted} />
              <TextInput
                style={[m.input, { color: colors.textPrimary }]}
                value={fields.fullName}
                onChangeText={set('fullName')}
                placeholder="Full name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <Text style={[m.label, { color: colors.textMuted }]}>Phone</Text>
            <View style={[m.field, { backgroundColor: colors.bgInput, borderColor: colors.borderInput }]}>
              <MaterialCommunityIcons name="phone-outline" size={16} color={colors.textMuted} />
              <TextInput
                style={[m.input, { color: colors.textPrimary }]}
                value={fields.phone}
                onChangeText={set('phone')}
                placeholder="Phone number"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>

            <Text style={[m.label, { color: colors.textMuted }]}>City</Text>
            <View style={[m.field, { backgroundColor: colors.bgInput, borderColor: colors.borderInput }]}>
              <MaterialCommunityIcons name="city-variant-outline" size={16} color={colors.textMuted} />
              <TextInput
                style={[m.input, { color: colors.textPrimary }]}
                value={fields.city}
                onChangeText={set('city')}
                placeholder="City"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <Text style={[m.label, { color: colors.textMuted }]}>Gender</Text>
            <View style={m.genderContainer}>
              {(['male', 'female', 'other'] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    m.genderOption,
                    { borderColor: fields.gender === g ? colors.accent : colors.borderCard },
                    fields.gender === g && { backgroundColor: colors.accent + '20' }
                  ]}
                  onPress={() => set('gender')(g)}
                >
                  <Text style={{ color: fields.gender === g ? colors.accent : colors.textMuted, fontSize: 13, fontWeight: '600' }}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={m.actions}>
              <TouchableOpacity style={[m.btn, m.cancelBtn, { borderColor: colors.borderCard }]} onPress={onClose}>
                <Text style={[m.btnText, { color: colors.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[m.btn, { backgroundColor: colors.accent }, saving && { opacity: 0.6 }]}
                onPress={() => onSave(fields)}
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={[m.btnText, { color: '#fff' }]}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}


const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  scroll: { flexGrow: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderWidth: 1, paddingBottom: 40 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 50, marginBottom: 16 },
  input: { flex: 1, fontSize: 14 },
  genderContainer: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  genderOption: { flex: 1, height: 40, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { borderWidth: 1 },
  btnText: { fontSize: 14, fontWeight: '700' },
});


// ── Theme mode pill selector ───────────────────────────────────────────────
function ThemePill({ value, label, icon, selected, onPress }: {
  value: ThemeMode; label: string; icon: string;
  selected: boolean; onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        tp.pill,
        { backgroundColor: selected ? colors.accent : colors.bgMuted, borderColor: selected ? colors.accent : colors.borderCard },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={16}
        color={selected ? colors.accentFg : colors.textMuted}
      />
      <Text style={[tp.text, { color: selected ? colors.accentFg : colors.textMuted }]}>{label}</Text>
    </TouchableOpacity>
  );
}
const tp = StyleSheet.create({
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  text: { fontSize: 13, fontWeight: '600' },
});

// ── Main Screen ───────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { colors, isDark, mode, toggle } = useTheme();
  const { user, logout, refreshProfile, updateUserInfo } = useAuth();
  const insets = useSafeAreaInsets();

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setRefreshing(true);
      await refreshProfile();
    } catch (err: any) {
      Alert.alert('Error', 'Failed to fetch profile: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  }, [refreshProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = useCallback(async (fields: EditField) => {
    try {
      setSaving(true);
      await updateUserInfo({
        fullName: fields.fullName,
        phone: fields.phone,
        gender: fields.gender,
        address: { city: fields.city }
      });
      setEditOpen(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (err: any) {
      Alert.alert('Update Failed', err.message);
    } finally {
      setSaving(false);
    }
  }, [updateUserInfo]);


  const handleLogout = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  }, [logout]);

  const displayName = user?.fullName ?? 'User';
  const initials    = getInitials(displayName);

  return (
    <View style={[styles.root, { backgroundColor: colors.bgBase }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bgBase}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchProfile} tintColor={colors.accent} />
        }
      >
        <View style={styles.avatarSection}>
          <View style={[styles.avatarRing, { borderColor: colors.accent + '55' }]}>
            <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
              <Text style={[styles.initials, { color: '#fff' }]}>{initials}</Text>
            </View>
          </View>
          <Text style={[styles.displayName, { color: colors.textPrimary }]}>{displayName}</Text>
          <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email}</Text>

          <TouchableOpacity
            style={[styles.editChip, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}
            onPress={() => setEditOpen(true)}
          >
            <MaterialCommunityIcons name="pencil-outline" size={14} color={colors.accent} />
            <Text style={[styles.editChipText, { color: colors.accent }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <SectionHeader label="Wallet & Status" />
        <View style={[styles.statusRow, { gap: 12 }]}>
          <View style={[styles.statusCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Balance</Text>
            <Text style={[styles.statusValue, { color: colors.textPrimary }]}>
              {user?.wallet?.currency} {user?.wallet?.balance.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>KYC Status</Text>
            <View style={[styles.kycBadge, { backgroundColor: user?.kycStatus === 'approved' ? colors.successBg : colors.pendingBg }]}>
              <Text style={[styles.kycText, { color: user?.kycStatus === 'approved' ? colors.successFg : colors.pendingFg }]}>
                {user?.kycStatus?.toUpperCase() ?? 'PENDING'}
              </Text>
            </View>
          </View>
        </View>

        <SectionHeader label="Details" />
        <RowItem icon="phone-outline" label="Phone" value={user?.phone} />
        <RowItem icon="gender-male-female" label="Gender" value={user?.gender ? (user.gender.charAt(0).toUpperCase() + user.gender.slice(1)) : 'Not Set'} />
        <RowItem icon="map-marker-outline" label="Location" value={user?.address?.city ? `${user.address.city}, ${user.address.country ?? 'India'}` : 'Not Set'} />

        <SectionHeader label="Appearance" />
        <View style={[styles.themeCard, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
          <View style={styles.themeHeader}>
            <MaterialCommunityIcons name="palette-outline" size={18} color={colors.accent} />
            <Text style={[styles.themeTitle, { color: colors.textPrimary }]}>Theme</Text>
          </View>
          <View style={styles.themePills}>
            <ThemePill value="light" label="Light" icon="weather-sunny" selected={mode === 'light'} onPress={toggle} />
            <ThemePill value="dark" label="Dark" icon="weather-night" selected={mode === 'dark'} onPress={toggle} />
          </View>
        </View>

        <SectionHeader label="Session" />
        <RowItem icon="logout" label="Sign Out" danger onPress={handleLogout} />
      </ScrollView>

      <EditProfileModal
        visible={editOpen}
        initial={{
          fullName: user?.fullName ?? '',
          phone: user?.phone ?? '',
          gender: user?.gender ?? 'male',
          city: user?.address?.city ?? ''
        }}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        saving={saving}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 8 },
  avatarRing: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatar: { width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 28, fontWeight: '800' },
  displayName: { fontSize: 20, fontWeight: '800' },
  email: { fontSize: 13, marginTop: 4, marginBottom: 12 },
  editChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  editChipText: { fontSize: 12, fontWeight: '700' },
  statusRow: { flexDirection: 'row' },
  statusCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
  statusLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  statusValue: { fontSize: 16, fontWeight: '700' },
  kycBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  kycText: { fontSize: 10, fontWeight: '800' },
  themeCard: { borderRadius: 16, borderWidth: 1, padding: 16 },
  themeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  themeTitle: { fontSize: 14, fontWeight: '700' },
  themePills: { flexDirection: 'row', gap: 10 },
});

