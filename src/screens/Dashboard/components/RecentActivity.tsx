import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Transaction } from '../hooks/useDashboard';

const STATUS_CONFIG = {
  success: { color: '#34D399', bg: '#0D2E1B', icon: 'check-circle-outline' },
  failed:  { color: '#F87171', bg: '#2E0D0D', icon: 'alert-circle-outline' },
  pending: { color: '#FBBF24', bg: '#2E250D', icon: 'clock-outline' },
};

interface Props {
  data: Transaction[];
}

export function RecentActivity({ data }: Props) {
  return (
    <View style={s.card}>
      <View style={s.header}>
        <Text style={s.title}>Recent Activity</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={s.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {data.map((item, idx) => {
        const cfg = STATUS_CONFIG[item.status];
        return (
          <View key={item.id} style={[s.row, idx < data.length - 1 && s.separator]}>
            <View style={[s.iconWrap, { backgroundColor: cfg.bg }]}>
              <MaterialCommunityIcons name={cfg.icon as any} size={18} color={cfg.color} />
            </View>
            <View style={s.info}>
              <Text style={s.txTitle} numberOfLines={1}>{item.title}</Text>
              <View style={s.meta}>
                <View style={[s.badge, { backgroundColor: cfg.bg }]}>
                  <Text style={[s.badgeText, { color: cfg.color }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={s.time}>{item.time}</Text>
              </View>
            </View>
            <Text style={[s.amount, { color: item.type === 'credit' ? '#34D399' : '#F1F5F9' }]}>
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
    backgroundColor: '#111C2E',
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
    color: '#FFFFFF',
  },
  seeAll: {
    fontSize: 12,
    color: '#4F8EF7',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#1A2640',
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
    color: '#E2E8F0',
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
    color: '#4A5568',
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 8,
  },
});
