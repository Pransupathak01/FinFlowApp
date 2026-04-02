import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  ScrollView, Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { FilterState } from '../hooks/useTransactions';
import { useTheme } from '../../../store/ThemeContext';

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
  const { colors } = useTheme();
  const active = value === current;
  return (
    <TouchableOpacity
      style={[
        chip.base,
        { backgroundColor: colors.bgBase, borderColor: colors.borderCard },
        active && { backgroundColor: colors.accent + '20', borderColor: colors.accent }
      ]}
      onPress={() => onSelect(value)}
      activeOpacity={0.75}
    >
      <Text style={[chip.text, { color: colors.textMuted }, active && { color: colors.accent }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={sec.wrap}>
      <Text style={[sec.title, { color: colors.textMuted }]}>{title}</Text>
      <View style={sec.chips}>{children}</View>
    </View>
  );
}

export function FilterModal({ visible, filters, onUpdate, onReset, onClose, categories }: Props) {
  const { colors } = useTheme();
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

      <View style={[m.sheet, { backgroundColor: colors.bgCard }]}>
        {/* Handle */}
        <View style={[m.handle, { backgroundColor: colors.borderCard }]} />

        {/* Header */}
        <View style={m.header}>
          <Text style={[m.heading, { color: colors.textPrimary }]}>Filters</Text>
          <View style={m.headerRight}>
            <TouchableOpacity onPress={onReset} style={[m.resetBtn, { backgroundColor: colors.bgBase, borderColor: colors.borderCard }]}>
              <Text style={m.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close" size={22} color={colors.textMuted} />
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
        <TouchableOpacity style={[m.applyBtn, { backgroundColor: colors.accent }]} onPress={onClose} activeOpacity={0.85}>
          <Text style={[m.applyText, { color: colors.accentFg }]}>Apply Filters</Text>
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
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
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
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(122, 132, 153, 0.2)',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
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
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

