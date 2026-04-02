import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Transaction } from '../hooks/useTransactions';

/** Fixed row height – required for getItemLayout optimisation */
export const ITEM_HEIGHT = 76;

const STATUS_META = {
  success: { color: '#34D399', bg: '#0D2E1B', icon: 'check-circle' },
  failed:  { color: '#F87171', bg: '#2E0D0D', icon: 'close-circle' },
  pending: { color: '#FBBF24', bg: '#2E250D', icon: 'clock' },
} as const;

interface Props {
  item: Transaction;
  onPress: (tx: Transaction) => void;
}

function TransactionItemComponent({ item, onPress }: Props) {
  const cfg = STATUS_META[item.status];

  const handlePress = useCallback(() => onPress(item), [item, onPress]);

  const formatted = '₹' + item.amount.toLocaleString('en-IN');

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      {/* Status icon */}
      <View style={[styles.icon, { backgroundColor: cfg.bg }]}>
        <MaterialCommunityIcons name={cfg.icon as any} size={20} color={cfg.color} />
      </View>

      {/* Title + subtitle */}
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.categoryPill, { borderColor: cfg.color + '40' }]}>
            <Text style={[styles.categoryText, { color: cfg.color }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.subtitle} numberOfLines={1}> · {item.subtitle}</Text>
        </View>
      </View>

      {/* Amount + date */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: item.type === 'credit' ? '#34D399' : '#F1F5F9' }]}>
          {item.type === 'credit' ? '+' : '−'}{formatted}
        </Text>
        <Text style={styles.date}>{item.dateLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

/** Wrapped in React.memo – re-renders only when the `item` reference changes */
export const TransactionItem = memo(TransactionItemComponent);

const styles = StyleSheet.create({
  row: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#111C2E',
    borderBottomWidth: 1,
    borderBottomColor: '#0F1927',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  middle: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryPill: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 11,
    color: '#4A5568',
    flexShrink: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 13,
    fontWeight: '700',
  },
  date: {
    fontSize: 10,
    color: '#4A5568',
  },
});
