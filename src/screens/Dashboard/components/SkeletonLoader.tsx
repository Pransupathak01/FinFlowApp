import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../store/ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const { colors } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View
      style={[{ width: width as number, height, borderRadius, opacity, backgroundColor: colors.bgSkeleton }, style]}
    />
  );
}

export function SkeletonCard() {
  const { colors } = useTheme();
  return (
    <View style={[sk.card, { backgroundColor: colors.bgCard }]}>
      <Skeleton width={100} height={12} borderRadius={6} />
      <Skeleton width={140} height={28} borderRadius={8} style={{ marginTop: 10 }} />
      <Skeleton width={80} height={10} borderRadius={5} style={{ marginTop: 8 }} />
    </View>
  );
}

export function SkeletonChart() {
  const { colors } = useTheme();
  return (
    <View style={[sk.chartCard, { backgroundColor: colors.bgCard }]}>
      <Skeleton width={160} height={14} borderRadius={7} />
      <View style={sk.bars}>
        {[60, 90, 50, 100, 70, 40, 80].map((h, i) => (
          <Skeleton key={i} width={28} height={h} borderRadius={6} style={{ alignSelf: 'flex-end' }} />
        ))}
      </View>
    </View>
  );
}

export function SkeletonActivity() {
  return (
    <View style={sk.activityRow}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
        <Skeleton width="70%" height={12} borderRadius={6} />
        <Skeleton width="40%" height={10} borderRadius={5} />
      </View>
      <Skeleton width={60} height={14} borderRadius={6} />
    </View>
  );
}

const sk = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    flex: 1,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 16,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
    marginTop: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
