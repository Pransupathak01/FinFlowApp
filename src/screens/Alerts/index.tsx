import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../store/ThemeContext';

const MOCK_ALERTS = [
  { id: '1', type: 'critical', title: 'Suspicious Activity Detected', body: 'A high-value transaction was attempted from an unrecognized device.', time: '10m ago' },
  { id: '2', type: 'warning',  title: 'Low Balance Warning', body: 'Primary bank account (HDFC) is below the threshold of ₹50,000.', time: '2h ago' },
  { id: '3', type: 'success',  title: 'Statement Sync Complete', body: 'Bank statement for Q4 has been successfully ingested and reconciled.', time: '5h ago' },
];

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const renderItem = ({ item }: { item: typeof MOCK_ALERTS[number] }) => {
    const icon = {
      critical: { name: 'alert-decagram', color: colors.failedFg, bg: colors.failedBg },
      warning:  { name: 'alert', color: colors.pendingFg, bg: colors.pendingBg },
      success:  { name: 'check-circle', color: colors.successFg, bg: colors.successBg },
    }[item.type as 'critical' | 'warning' | 'success'];

    return (
      <View style={[s.card, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]}>
        <View style={[s.iconBox, { backgroundColor: icon.bg }]}>
          <MaterialCommunityIcons name={icon.name as any} size={20} color={icon.color} />
        </View>
        <View style={s.content}>
          <Text style={[s.title, { color: colors.textPrimary }]}>{item.title}</Text>
          <Text style={[s.body, { color: colors.textMuted }]}>{item.body}</Text>
          <Text style={[s.time, { color: colors.textMuted }]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[s.root, { backgroundColor: colors.bgBase }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgBase} />
      <View style={[s.header, { paddingTop: insets.top + 20 }]}>
        <Text style={[s.heading, { color: colors.textPrimary }]}>Alerts</Text>
      </View>
      <FlatList
        data={MOCK_ALERTS}
        renderItem={renderItem}
        keyExtractor={it => it.id}
        contentContainerStyle={s.list}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  heading: { fontSize: 24, fontWeight: '800' },
  list: { paddingHorizontal: 20, gap: 12 },
  card: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, gap: 14 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 14, fontWeight: '700' },
  body: { fontSize: 12, lineHeight: 18 },
  time: { fontSize: 10, marginTop: 4 }
});
