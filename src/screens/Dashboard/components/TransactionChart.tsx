import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
  VictoryTooltip,
} from 'victory-native';

interface ChartPoint { x: string; y: number; failed: number }

interface Props {
  data: ChartPoint[];
}

export function TransactionChart({ data }: Props) {
  const [view, setView] = useState<'today' | 'weekly'>('weekly');

  const displayData = view === 'today' ? data.slice(-1) : data;

  const successData = displayData.map(d => ({ x: d.x, y: d.y }));
  const failedData  = displayData.map(d => ({ x: d.x, y: d.failed }));

  return (
    <View style={s.card}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Transactions</Text>
        <View style={s.toggle}>
          {(['today', 'weekly'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[s.pill, view === t && s.pillActive]}
              onPress={() => setView(t)}
              activeOpacity={0.8}
            >
              <Text style={[s.pillText, view === t && s.pillTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.dot, { backgroundColor: '#4F8EF7' }]} />
          <Text style={s.legendText}>Success</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.dot, { backgroundColor: '#F87171' }]} />
          <Text style={s.legendText}>Failed</Text>
        </View>
      </View>

      {/* Chart */}
      <VictoryChart
        height={180}
        padding={{ top: 10, bottom: 30, left: 40, right: 16 }}
        domainPadding={{ x: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fill: '#4A5568', fontSize: 10, fontWeight: '500' },
            grid: { stroke: 'transparent' },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: 'transparent' },
            tickLabels: { fill: '#4A5568', fontSize: 10 },
            grid: { stroke: '#1A2640', strokeDasharray: '4,4' },
          }}
        />
        <VictoryGroup offset={16}>
          <VictoryBar
            data={successData}
            cornerRadius={{ top: 4 }}
            style={{ data: { fill: '#4F8EF7', width: 12 } }}
            labelComponent={<VictoryTooltip />}
          />
          <VictoryBar
            data={failedData}
            cornerRadius={{ top: 4 }}
            style={{ data: { fill: '#F87171', width: 12 } }}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryGroup>
      </VictoryChart>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#0B1120',
    borderRadius: 8,
    padding: 3,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pillActive: {
    backgroundColor: '#1E2D45',
  },
  pillText: {
    fontSize: 11,
    color: '#7A8499',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#4F8EF7',
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
    color: '#7A8499',
  },
});
