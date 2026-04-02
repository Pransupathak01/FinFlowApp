import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../store/ThemeContext';

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
  const { colors } = useTheme();

  return (
    <View style={[s.card, { backgroundColor: colors.bgCard }]}>
      <View style={[s.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={[s.label, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[s.value, { color: colors.textPrimary }]}>{value}</Text>
      <View style={s.row}>
        {sub && <Text style={[s.sub, { color: colors.textMuted }]}>{sub}</Text>}
        {trend && (
          <View style={[s.trend, { backgroundColor: trend.up ? colors.successBg : colors.failedBg }]}>
            <MaterialCommunityIcons
              name={trend.up ? 'trending-up' : 'trending-down'}
              size={12}
              color={trend.up ? colors.successFg : colors.failedFg}
            />
            <Text style={[s.trendText, { color: trend.up ? colors.successFg : colors.failedFg }]}>
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
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
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
