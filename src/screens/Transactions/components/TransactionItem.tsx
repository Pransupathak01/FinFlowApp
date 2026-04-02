import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Transaction } from '../hooks/useTransactions';
import { useTheme } from '../../../store/ThemeContext';

/** Fixed row height – required for getItemLayout optimisation */
export const ITEM_HEIGHT = 76;

interface Props {
  item: Transaction;
  onPress: (tx: Transaction) => void;
}

function TransactionItemComponent({ item, onPress }: Props) {
  const { colors } = useTheme();
  
  const statusMeta = {
    success: { color: colors.successFg, bg: colors.successBg, icon: 'check-circle' },
    failed:  { color: colors.failedFg,  bg: colors.failedBg,  icon: 'close-circle' },
    pending: { color: colors.pendingFg, bg: colors.pendingBg, icon: 'clock' },
  } as const;

  const cfg = statusMeta[item.status];
  const handlePress = useCallback(() => onPress(item), [item, onPress]);
  const formatted = '₹' + item.amount.toLocaleString('en-IN');

  return (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.bgCard, borderBottomColor: colors.borderSep }]}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      {/* Status icon */}
      <View style={[styles.icon, { backgroundColor: cfg.bg }]}>
        <MaterialCommunityIcons name={cfg.icon as any} size={20} color={cfg.color} />
      </View>

      {/* Title + subtitle */}
      <View style={styles.middle}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.categoryPill, { borderColor: cfg.color + '40' }]}>
            <Text style={[styles.categoryText, { color: cfg.color }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}> · {item.subtitle}</Text>
        </View>
      </View>

      {/* Amount + date */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: item.type === 'credit' ? colors.successFg : colors.textPrimary }]}>
          {item.type === 'credit' ? '+' : '−'}{formatted}
        </Text>
        <Text style={[styles.date, { color: colors.textMuted }]}>{item.dateLabel}</Text>
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
    borderBottomWidth: 1,
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
  },
});

