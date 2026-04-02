import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Transaction } from '../hooks/useDashboard';
import { useTheme } from '../../../store/ThemeContext';

interface Props {
  data: Transaction[];
}

export function RecentActivity({ data }: Props) {
  const { colors } = useTheme();

  const STATUS_CONFIG = {
    success: { color: colors.successFg, bg: colors.successBg, icon: 'check-circle-outline' },
    failed:  { color: colors.failedFg,  bg: colors.failedBg,  icon: 'alert-circle-outline' },
    pending: { color: colors.pendingFg, bg: colors.pendingBg, icon: 'clock-outline' },
  };

  return (
    <View style={[s.card, { backgroundColor: colors.bgCard }]}>
      <View style={s.header}>
        <Text style={[s.title, { color: colors.textPrimary }]}>Recent Activity</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[s.seeAll, { color: colors.textLink }]}>See All</Text>
        </TouchableOpacity>
      </View>

      {data.map((item, idx) => {
        const cfg = STATUS_CONFIG[item.status];
        return (
          <View key={item.id} style={[s.row, idx < data.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderSep }]}>
            <View style={[s.iconWrap, { backgroundColor: cfg.bg }]}>
              <MaterialCommunityIcons name={cfg.icon as any} size={18} color={cfg.color} />
            </View>
            <View style={s.info}>
              <Text style={[s.txTitle, { color: colors.textSecondary }]} numberOfLines={1}>{item.title}</Text>
              <View style={s.meta}>
                <View style={[s.badge, { backgroundColor: cfg.bg }]}>
                  <Text style={[s.badgeText, { color: cfg.color }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={[s.time, { color: colors.textMuted }]}>{item.time}</Text>
              </View>
            </View>
            <Text style={[s.amount, { color: item.type === 'credit' ? colors.successFg : colors.textSecondary }]}>
              {item.amount}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
    gap: 5,
  },
  txTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  time: {
    fontSize: 11,
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
});
