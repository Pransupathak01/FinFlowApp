import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, FlatList,
  Modal, TextInput, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useReconciliation, ReconItem } from './hooks/useReconciliation';
import { useTheme } from '../../store/ThemeContext';

// ── Tab component ────────────────────────────────────────────────────────
function Tab({ label, count, active, onPress }: { label: string; count: number; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[t.pill, active && { backgroundColor: active ? colors.accent : colors.bgMuted }]}
      activeOpacity={0.8}
    >
      <Text style={[t.label, { color: active ? colors.accentFg : colors.textMuted }]}>{label}</Text>
      <View style={[t.badge, { backgroundColor: active ? 'rgba(255,255,255,0.2)' : colors.borderCard }]}>
        <Text style={[t.badgeText, { color: active ? colors.accentFg : colors.textMuted }]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}
const t = StyleSheet.create({
  pill:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  label:     { fontSize: 13, fontWeight: '700' },
  badge:     { paddingHorizontal: 6, borderRadius: 6, minWidth: 20, alignItems: 'center' },
  badgeText: { fontSize: 10, fontWeight: '800' }
});

// ── Main UI ─────────────────────────────────────────────────────────────
export default function ReconciliationScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const {
    unmatched, matched, selectedIds,
    toggleSelect, selectAll, clearSelection,
    matchItems, resolveDispute, addNote
  } = useReconciliation();

  const [activeTab, setActiveTab] = useState<'unmatched' | 'matched'>('unmatched');
  const [detailItem, setDetailItem] = useState<ReconItem | null>(null);
  const [noteText, setNoteText] = useState('');

  const currentList = activeTab === 'unmatched' ? unmatched : matched;

  const handleApplyMultiMatch = () => {
    const ids = Array.from(selectedIds);
    Alert.alert('Apply Batch Match?', `Successfully reconcile ${ids.length} selected items?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => matchItems(ids) },
    ]);
  };

  const handleQuickResolve = (item: ReconItem) => {
    Alert.alert('Mark as Resolved?', 'Confirm manually matching this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => resolveDispute(item.id, 'Manually resolved by user') },
    ]);
  };

  const saveNote = () => {
    if (detailItem) {
      addNote(detailItem.id, noteText);
      setDetailItem(null);
      setNoteText('');
    }
  };

  const renderItem = ({ item }: { item: ReconItem }) => {
    const isSelected = selectedIds.has(item.id);
    const mismatch = item.mismatchReason;
    
    return (
      <TouchableOpacity
        style={[r.card, { backgroundColor: colors.bgCard, borderColor: isSelected ? colors.accent : colors.borderCard }]}
        onPress={() => activeTab === 'unmatched' ? toggleSelect(item.id) : setDetailItem(item)}
        onLongPress={() => setDetailItem(item)}
        activeOpacity={0.8}
      >
        <View style={r.top}>
          <View style={r.info}>
            <Text style={[r.title, { color: colors.textPrimary }]}>{item.txTitle}</Text>
            <Text style={[r.sub, { color: colors.textMuted }]}>{item.source}</Text>
          </View>
          <View style={r.amountArea}>
            <Text style={[r.amount, { color: colors.textPrimary }]}>₹{item.txAmount.toLocaleString()}</Text>
            <Text style={[r.date, { color: colors.textMuted }]}>{item.txDate}</Text>
          </View>
          {activeTab === 'unmatched' && (
            <View style={[r.checkbox, { backgroundColor: isSelected ? colors.accent : colors.bgMuted, borderColor: isSelected ? colors.accent : colors.borderCard }]}>
              {isSelected && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
            </View>
          )}
        </View>

        {mismatch && (
          <View style={[r.mismatch, { backgroundColor: colors.failedBg + '30', borderColor: colors.failedFg + '30' }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={14} color={colors.failedFg} />
            <Text style={[r.mismatchText, { color: colors.failedFg }]}>{mismatch}</Text>
          </View>
        )}

        {item.notes && (
          <View style={[r.noteRow, { backgroundColor: colors.bgBase }]}>
            <MaterialCommunityIcons name="note-text-outline" size={12} color={colors.textMuted} />
            <Text style={[r.noteText, { color: colors.textMuted }]}>{item.notes}</Text>
          </View>
        )}

        <View style={r.actions}>
          <TouchableOpacity style={r.actionBtn} onPress={() => setDetailItem(item)}>
            <MaterialCommunityIcons name="dots-horizontal" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          {activeTab === 'unmatched' && (
            <TouchableOpacity 
              style={[r.resolveBtn, { borderColor: colors.accent }]} 
              onPress={() => handleQuickResolve(item)}
            >
              <Text style={[r.resolveBtnText, { color: colors.accent }]}>Match</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[s.root, { backgroundColor: colors.bgBase }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bgBase} />
      
      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <View>
          <Text style={[s.heading, { color: colors.textPrimary }]}>Reconciliation</Text>
          <Text style={[s.subheading, { color: colors.textMuted }]}>Review and resolve bank mismatches</Text>
        </View>
      </View>

      {/* ── Tabs ── */}
      <View style={s.tabRow}>
        <Tab label="Pending" count={unmatched.length} active={activeTab === 'unmatched'} onPress={() => { setActiveTab('unmatched'); clearSelection(); }} />
        <Tab label="Review"  count={matched.length}   active={activeTab === 'matched'}   onPress={() => { setActiveTab('matched');   clearSelection(); }} />
      </View>

      {/* ── Selection Control ── */}
      {selectedIds.size > 0 && (
        <View style={[s.selectionBar, { backgroundColor: colors.accent }]}>
          <Text style={[s.selectionText, { color: colors.accentFg }]}>{selectedIds.size} items selected</Text>
          <View style={s.selectionActions}>
            <TouchableOpacity onPress={clearSelection}>
              <Text style={[s.dismissText, { color: colors.accentFg }]}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.batchMatchBtn} onPress={handleApplyMultiMatch}>
              <Text style={s.batchMatchText}>Batch Match</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── List ── */}
      {currentList.length === 0 ? (
        <View style={s.empty}>
          <MaterialCommunityIcons name="check-circle-outline" size={48} color={colors.successFg} />
          <Text style={{ marginTop: 10, color: colors.textMuted }}>No items to reconcile. You are all set!</Text>
        </View>
      ) : (
        <FlatList
          data={currentList}
          renderItem={renderItem}
          keyExtractor={u => u.id}
          contentContainerStyle={[s.list, { paddingBottom: selectedIds.size > 0 ? 100 : 40 }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── Details Modal ── */}
      <Modal visible={!!detailItem} animationType="slide" transparent>
        <View style={m.overlay}>
          <View style={[m.sheet, { backgroundColor: colors.bgCard }]}>
            <View style={[m.handle, { backgroundColor: colors.borderCard }]} />
            <Text style={[m.title, { color: colors.textPrimary }]}>Item Details</Text>
            
            {detailItem && (
              <View style={m.body}>
                <View style={m.detailGrid}>
                  <View style={m.detailItem}>
                    <Text style={[m.detailLabel, { color: colors.textMuted }]}>Internal Name</Text>
                    <Text style={[m.detailVal, { color: colors.textPrimary }]}>{detailItem.txTitle}</Text>
                  </View>
                  <View style={m.detailItem}>
                    <Text style={[m.detailLabel, { color: colors.textMuted }]}>Bank Source</Text>
                    <Text style={[m.detailVal, { color: colors.textPrimary }]}>{detailItem.source}</Text>
                  </View>
                  <View style={m.detailItem}>
                    <Text style={[m.detailLabel, { color: colors.textMuted }]}>Transaction</Text>
                    <Text style={[m.detailVal, { color: colors.textPrimary }]}>₹{detailItem.txAmount.toLocaleString()} · {detailItem.txDate}</Text>
                  </View>
                  <View style={m.detailItem}>
                    <Text style={[m.detailLabel, { color: colors.textMuted }]}>Bank Entry</Text>
                    <Text style={[m.detailVal, { color: colors.textPrimary }]}>₹{detailItem.bankAmount.toLocaleString()} · {detailItem.bankDate}</Text>
                  </View>
                </View>

                <Text style={[m.label, { color: colors.textPrimary, marginTop: 20 }]}>Notes</Text>
                <TextInput
                  style={[m.input, { backgroundColor: colors.bgBase, color: colors.textPrimary, borderColor: colors.borderCard }]}
                  multiline
                  placeholder="Add notes about this reconciliation..."
                  placeholderTextColor={colors.textMuted}
                  value={noteText || detailItem.notes || ''}
                  onChangeText={setNoteText}
                />

                <View style={m.footer}>
                  <TouchableOpacity style={[m.closeBtn, { borderColor: colors.borderCard }]} onPress={() => setDetailItem(null)}>
                    <Text style={{ color: colors.textMuted }}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[m.saveBtn, { backgroundColor: colors.accent }]} onPress={saveNote}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Save Note</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  heading: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subheading: { fontSize: 13, marginTop: 4 },
  tabRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  list: { paddingHorizontal: 20, gap: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  selectionBar: { position: 'absolute', bottom: 30, left: 20, right: 20, height: 60, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, zIndex: 100 },
  selectionText: { fontSize: 14, fontWeight: '700' },
  selectionActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  dismissText: { fontSize: 13, fontWeight: '600' },
  batchMatchBtn: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  batchMatchText: { color: '#000', fontSize: 13, fontWeight: '700' }
});

const r = StyleSheet.create({
  card: { borderRadius: 16, borderLeftWidth: 4, padding: 16, borderWidth: 1, backgroundColor: '#fff' },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700' },
  sub: { fontSize: 11, marginTop: 2 },
  amountArea: { alignItems: 'flex-end' },
  amount: { fontSize: 14, fontWeight: '800' },
  date: { fontSize: 10, marginTop: 2 },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  mismatch: { marginTop: 12, padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1 },
  mismatchText: { fontSize: 11, fontWeight: '600' },
  noteRow: { marginTop: 12, padding: 8, borderRadius: 8, flexDirection: 'row', gap: 6 },
  noteText: { fontSize: 11, fontStyle: 'italic', flex: 1 },
  actions: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  resolveBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  resolveBtnText: { fontSize: 12, fontWeight: '700' }
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 20 },
  body: { gap: 16 },
  detailGrid: { gap: 12 },
  detailItem: { gap: 4 },
  detailLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  detailVal: { fontSize: 14, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '700' },
  input: { height: 100, borderRadius: 12, borderWidth: 1, padding: 12, textAlignVertical: 'top', marginTop: 8 },
  footer: { flexDirection: 'row', gap: 12, marginTop: 24 },
  closeBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  saveBtn: { flex: 1, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }
});
