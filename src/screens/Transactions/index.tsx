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

// ── FlatList optimisation helpers ──────────────────────────────────────────
const keyExtractor = (item: Transaction) => item.id;

/**
 * getItemLayout lets FlatList skip layout measurement for every row.
 * Only works because every TransactionItem has a fixed ITEM_HEIGHT.
 */
const getItemLayout = (_: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

// ── Section header (date group) ────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyList() {
  return (
    <View style={s.empty}>
      <Text style={s.emptyIcon}>🔍</Text>
      <Text style={s.emptyTitle}>No transactions found</Text>
      <Text style={s.emptySub}>Try adjusting your search or filters</Text>
    </View>
  );
}

// ── Skeleton rows for initial load ─────────────────────────────────────────
function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} style={[s.skeletonRow, { opacity: 1 - i * 0.07 }]}>
          <View style={s.skeletonIcon} />
          <View style={s.skeletonMid}>
            <View style={[s.skeletonLine, { width: '65%' }]} />
            <View style={[s.skeletonLine, { width: '40%', height: 10 }]} />
          </View>
          <View style={s.skeletonRight}>
            <View style={[s.skeletonLine, { width: 70 }]} />
            <View style={[s.skeletonLine, { width: 44, height: 10 }]} />
          </View>
        </View>
      ))}
    </>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────--
export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
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

  // ── Memoised render function (avoids inline arrow in renderItem)
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

  const keyExtractorMixed = useCallback(
    (item: typeof listData[number]) =>
      'type' in item ? `h-${item.label}` : (item as Transaction).id,
    [],
  );

  // Summary counts
  const summary = useMemo(() => ({
    total: transactions.length,
    success: transactions.filter(t => t.status === 'success').length,
    failed:  transactions.filter(t => t.status === 'failed').length,
  }), [transactions]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1120" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Transactions</Text>
          {!loading && (
            <Text style={styles.subheading}>
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
          // Skip measuring rows – massive perf win for long lists
          getItemLayout={(data, index) => {
            const item = data?.[index];
            const isHeader = item && 'type' in item;
            return {
              length: isHeader ? 36 : ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index, // approximate; good enough for scroll
              index,
            };
          }}
          // Tune render window for smooth scrolling
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={5}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
          ListEmptyComponent={<EmptyList />}
          contentContainerStyle={styles.listContent}
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
    backgroundColor: '#0B1120',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 3,
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
});

const s = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0B1120',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
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
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#7A8499' },
  emptySub:   { fontSize: 13, color: '#4A5568', marginTop: 6 },
  // Skeleton
  skeletonRow: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0F1927',
  },
  skeletonIcon: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#1E2D45', marginRight: 12,
  },
  skeletonMid: { flex: 1, gap: 8 },
  skeletonRight: { alignItems: 'flex-end', gap: 8 },
  skeletonLine: {
    height: 13, borderRadius: 6, backgroundColor: '#1E2D45',
  },
});
