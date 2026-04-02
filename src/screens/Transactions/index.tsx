import React, { useCallback, useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ListRenderItemInfo, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTransactions } from './hooks/useTransactions';
import type { Transaction } from './hooks/useTransactions';
import { TransactionItem, ITEM_HEIGHT } from './components/TransactionItem';
import { SearchBar } from './components/SearchBar';
import { FilterModal } from './components/FilterModal';
import { useTheme } from '../../store/ThemeContext';

// ── FlatList optimisation helpers ──────────────────────────────────────────
const keyExtractorMixed = (item: any) =>
  item.type === 'header' ? `h-${item.label}` : (item as Transaction).id;

/**
 * getItemLayout lets FlatList skip layout measurement for every row.
 */
const getItemLayout = (data: any, index: number) => {
  const item = data?.[index];
  const isHeader = item && 'type' in item;
  return {
    length: isHeader ? 36 : ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index, // approximate; good enough for scroll
    index,
  };
};

// ── Section header (date group) ────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={[s.sectionHeader, { backgroundColor: colors.bgBase }]}>
      <Text style={[s.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
    </View>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyList() {
  const { colors } = useTheme();
  return (
    <View style={s.empty}>
      <Text style={s.emptyIcon}>🔍</Text>
      <Text style={[s.emptyTitle, { color: colors.textSecondary }]}>No transactions found</Text>
      <Text style={[s.emptySub, { color: colors.textMuted }]}>Try adjusting your search or filters</Text>
    </View>
  );
}

// ── Skeleton rows for initial load ─────────────────────────────────────────
function SkeletonRows() {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.bgBase, flex: 1 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <View key={i} style={[s.skeletonRow, { opacity: 1 - i * 0.07, borderBottomColor: colors.borderSep }]}>
          <View style={[s.skeletonIcon, { backgroundColor: colors.bgSkeleton }]} />
          <View style={s.skeletonMid}>
            <View style={[s.skeletonLine, { width: '65%', backgroundColor: colors.bgSkeleton }]} />
            <View style={[s.skeletonLine, { width: '40%', height: 10, backgroundColor: colors.bgSkeleton }]} />
          </View>
          <View style={s.skeletonRight}>
            <View style={[s.skeletonLine, { width: 70, backgroundColor: colors.bgSkeleton }]} />
            <View style={[s.skeletonLine, { width: 44, height: 10, backgroundColor: colors.bgSkeleton }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────--
export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [filterVisible, setFilterVisible] = useState(false);

  const {
    query, setQuery,
    filters, updateFilters, resetFilters,
    activeFilterCount,
    transactions,
    loading,
    categories,
  } = useTransactions();

  // Group transactions by date label for section separators
  const listData = useMemo(() => {
    const result: (Transaction | { type: 'header'; label: string })[] = [];
    let lastLabel = '';
    for (const tx of transactions) {
      if (tx.dateLabel !== lastLabel) {
        result.push({ type: 'header', label: tx.dateLabel });
        lastLabel = tx.dateLabel;
      }
      result.push(tx);
    }
    return result;
  }, [transactions]);

  // ── Memoised render function
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<typeof listData[number]>) => {
      if ('type' in item && item.type === 'header') {
        return <SectionHeader title={item.label} />;
      }
      return (
        <TransactionItem
          item={item as Transaction}
          onPress={(tx) => console.log('pressed', tx.id)}
        />
      );
    },
    [],
  );

  // Summary counts
  const summary = useMemo(() => ({
    total: transactions.length,
    success: transactions.filter(t => t.status === 'success').length,
    failed: transactions.filter(t => t.status === 'failed').length,
  }), [transactions]);

  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: colors.bgBase }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bgBase}
      />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.heading, { color: colors.textPrimary }]}>Transactions</Text>
          {!loading && (
            <Text style={[styles.subheading, { color: colors.textMuted }]}>
              {summary.total} results · {summary.success} success · {summary.failed} failed
            </Text>
          )}
        </View>
      </View>

      {/* ── Search + Filter ── */}
      <SearchBar
        onSearch={setQuery}
        filterCount={activeFilterCount}
        onFilterPress={() => setFilterVisible(true)}
      />

      {/* ── List ── */}
      {loading ? (
        <SkeletonRows />
      ) : (
        <FlatList
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractorMixed}
          getItemLayout={getItemLayout}
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          ListEmptyComponent={<EmptyList />}
          contentContainerStyle={[styles.listContent, { backgroundColor: colors.bgBase }]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}

      {/* ── Filter Modal ── */}
      <FilterModal
        visible={filterVisible}
        filters={filters}
        onUpdate={updateFilters}
        onReset={resetFilters}
        onClose={() => setFilterVisible(false)}
        categories={categories}
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 12,
    marginTop: 3,
  },
  listContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
});

const s = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 40, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 13, marginTop: 6 },
  // Skeleton
  skeletonRow: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  skeletonIcon: {
    width: 40, height: 40, borderRadius: 12, marginRight: 12,
  },
  skeletonMid: { flex: 1, gap: 8 },
  skeletonRight: { alignItems: 'flex-end', gap: 8 },
  skeletonLine: {
    height: 13, borderRadius: 6,
  },
});

