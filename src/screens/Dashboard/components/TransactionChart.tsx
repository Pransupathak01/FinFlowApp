import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
  VictoryTooltip,
} from 'victory-native';
import { useTheme } from '../../../store/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChartPoint { x: string; y: number; failed: number }

interface Props {
  data: ChartPoint[];
}

export function TransactionChart({ data }: Props) {
  const { colors } = useTheme();
  const [view, setView] = useState<'today' | 'weekly'>('weekly');

  const displayData = view === 'today' ? data.slice(-1) : data;
  const successData = displayData.map(d => ({ x: d.x, y: d.y }));
  const failedData  = displayData.map(d => ({ x: d.x, y: d.failed }));

  // SCREEN_WIDTH - 40 (dashboard horizontal padding) - 36 (card horizontal padding)
  const chartWidth = SCREEN_WIDTH - 76;

  return (
    <View style={[s.card, { backgroundColor: colors.bgCard }]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={[s.title, { color: colors.textPrimary }]}>Transactions</Text>
        <View style={[s.toggle, { backgroundColor: colors.bgBase }]}>
          {(['today', 'weekly'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[s.pill, view === t && { backgroundColor: colors.bgMuted }]}
              onPress={() => setView(t)}
              activeOpacity={0.8}
            >
              <Text style={[s.pillText, { color: colors.textMuted }, view === t && { color: colors.accent }]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.dot, { backgroundColor: colors.accent }]} />
          <Text style={[s.legendText, { color: colors.textMuted }]}>Success</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.dot, { backgroundColor: colors.failedFg }]} />
          <Text style={[s.legendText, { color: colors.textMuted }]}>Failed</Text>
        </View>
      </View>

      {/* Chart */}
      <VictoryChart
        width={chartWidth}
        height={180}
        padding={{ top: 10, bottom: 30, left: 40, right: 10 }}
        domainPadding={{ x: 25 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fill: colors.textMuted, fontSize: 10, fontWeight: '500' },
            grid: { stroke: 'transparent' },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fill: colors.textMuted, fontSize: 10 },
            grid: { stroke: colors.borderSep, strokeDasharray: '4,4' },
          }}
        />
        <VictoryGroup offset={10}>
          <VictoryBar
            data={successData}
            cornerRadius={{ top: 4 }}
            style={{ data: { fill: colors.accent, width: 8 } }}
            labelComponent={<VictoryTooltip />}
          />
          <VictoryBar
            data={failedData}
            cornerRadius={{ top: 4 }}
            style={{ data: { fill: colors.failedFg, width: 8 } }}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryGroup>
      </VictoryChart>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 3,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
  },
});
