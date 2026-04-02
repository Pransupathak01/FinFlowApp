import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  ScrollView, Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { FilterState } from '../hooks/useTransactions';

interface Props {
  visible: boolean;
  filters: FilterState;
  onUpdate: (next: Partial<FilterState>) => void;
  onReset: () => void;
  onClose: () => void;
  categories: string[];
}

function Chip<T extends string>({
  label, value, current, onSelect,
}: { label: string; value: T; current: T; onSelect: (v: T) => void }) {
  const active = value === current;
  return (
    <TouchableOpacity
      style={[chip.base, active && chip.active]}
      onPress={() => onSelect(value)}
      activeOpacity={0.75}
    >
      <Text style={[chip.text, active && chip.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sec.wrap}>
      <Text style={sec.title}>{title}</Text>
      <View style={sec.chips}>{children}</View>
    </View>
  );
}

export function FilterModal({ visible, filters, onUpdate, onReset, onClose, categories }: Props) {
  const setStatus   = useCallback((v: FilterState['status'])    => onUpdate({ status: v }),   [onUpdate]);
  const setType     = useCallback((v: FilterState['type'])      => onUpdate({ type: v }),     [onUpdate]);
  const setCategory = useCallback((v: string)                   => onUpdate({ category: v }), [onUpdate]);
  const setRange    = useCallback((v: FilterState['dateRange']) => onUpdate({ dateRange: v }), [onUpdate]);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <Pressable style={m.backdrop} onPress={onClose} />

      <View style={m.sheet}>
        {/* Handle */}
        <View style={m.handle} />

        {/* Header */}
        <View style={m.header}>
          <Text style={m.heading}>Filters</Text>
          <View style={m.headerRight}>
            <TouchableOpacity onPress={onReset} style={m.resetBtn}>
              <Text style={m.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={22} color="#7A8499" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={m.scroll}>
          {/* Status */}
          <Section title="Status">
            <Chip label="All"     value="all"     current={filters.status} onSelect={setStatus} />
            <Chip label="Success" value="success" current={filters.status} onSelect={setStatus} />
            <Chip label="Pending" value="pending" current={filters.status} onSelect={setStatus} />
            <Chip label="Failed"  value="failed"  current={filters.status} onSelect={setStatus} />
          </Section>

          {/* Type */}
          <Section title="Type">
            <Chip label="All"    value="all"    current={filters.type} onSelect={setType} />
            <Chip label="Credit" value="credit" current={filters.type} onSelect={setType} />
            <Chip label="Debit"  value="debit"  current={filters.type} onSelect={setType} />
          </Section>

          {/* Date Range */}
          <Section title="Date Range">
            <Chip label="All Time"   value="all"   current={filters.dateRange} onSelect={setRange} />
            <Chip label="Today"      value="today" current={filters.dateRange} onSelect={setRange} />
            <Chip label="Last 7 days" value="7d"  current={filters.dateRange} onSelect={setRange} />
            <Chip label="Last 30 days" value="30d" current={filters.dateRange} onSelect={setRange} />
          </Section>

          {/* Category */}
          <Section title="Category">
            <Chip label="All" value="all" current={filters.category} onSelect={setCategory} />
            {categories.map(cat => (
              <Chip key={cat} label={cat} value={cat} current={filters.category} onSelect={setCategory} />
            ))}
          </Section>
        </ScrollView>

        {/* Apply */}
        <TouchableOpacity style={m.applyBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={m.applyText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// ── Chip styles ─────────────────────────────────────────────────────────────
const chip = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#0B1120',
    borderWidth: 1,
    borderColor: '#1A2640',
  },
  active: {
    backgroundColor: '#172B4D',
    borderColor: '#4F8EF7',
  },
  text: {
    fontSize: 12,
    color: '#7A8499',
    fontWeight: '600',
  },
  textActive: {
    color: '#4F8EF7',
  },
});

// ── Section styles ───────────────────────────────────────────────────────────
const sec = StyleSheet.create({
  wrap: {
    marginBottom: 24,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7A8499',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

// ── Modal styles ─────────────────────────────────────────────────────────────
const m = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000080',
  },
  sheet: {
    backgroundColor: '#111C2E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1A2640',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2640',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0B1120',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1A2640',
  },
  resetText: {
    fontSize: 12,
    color: '#F87171',
    fontWeight: '600',
  },
  scroll: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  applyBtn: {
    marginTop: 12,
    backgroundColor: '#4F8EF7',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
