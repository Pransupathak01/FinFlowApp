import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  trend?: { value: string; up: boolean };
}

export function StatCard({ label, value, sub, icon, iconColor, iconBg, trend }: StatCardProps) {
  return (
    <View style={s.card}>
      <View style={[s.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
      <View style={s.row}>
        {sub && <Text style={s.sub}>{sub}</Text>}
        {trend && (
          <View style={[s.trend, { backgroundColor: trend.up ? '#0D2E1B' : '#2E0D0D' }]}>
            <MaterialCommunityIcons
              name={trend.up ? 'trending-up' : 'trending-down'}
              size={12}
              color={trend.up ? '#34D399' : '#F87171'}
            />
            <Text style={[s.trendText, { color: trend.up ? '#34D399' : '#F87171' }]}>
              {trend.value}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#111C2E',
    borderRadius: 16,
    padding: 18,
    flex: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    color: '#7A8499',
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  sub: {
    fontSize: 11,
    color: '#4A5568',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
