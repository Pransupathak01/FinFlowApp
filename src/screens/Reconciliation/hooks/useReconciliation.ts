import { useState, useEffect, useCallback, useMemo } from 'react';
import { getReconciliationList, batchMatchItems, resolveSingleItem } from '../../../services/reconService';
import { Alert } from 'react-native';

export type ReconStatus = 'unmatched' | 'matched' | 'disputed';

export interface ReconItem {
  id: string;
  txTitle: string;
  txAmount: number;
  txDate: string;
  source: string;
  bankAmount: number;
  bankDate: string;
  status: ReconStatus;
  mismatchReason?: string;
  notes?: string;
}

export function useReconciliation() {
  const [data, setData] = useState<ReconItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Fetching Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetching both for convenience (or can fetch on tab switch)
      const [u, m] = await Promise.all([
        getReconciliationList('unmatched'),
        getReconciliationList('matched'),
      ]);
      setData([...u, ...m]);
    } catch (err: any) {
      console.error('[Recon Error]', err);
      Alert.alert('Load Failed', 'Could not fetch reconciliation data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Filters
  const unmatched = useMemo(() => data.filter(i => i.status === 'unmatched'), [data]);
  const matched   = useMemo(() => data.filter(i => i.status === 'matched'), [data]);

  // ── Multi-select actions
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ── Actions
  const matchItems = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      await batchMatchItems(ids);
      await fetchData(); // Refresh
      setSelectedIds(new Set());
    } catch (err: any) {
      Alert.alert('Match failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const resolveDispute = useCallback(async (id: string, notes?: string) => {
    try {
      setLoading(true);
      await resolveSingleItem(id, notes);
      await fetchData(); // Refresh
    } catch (err: any) {
      Alert.alert('Resolve failed', err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const addNote = useCallback((id: string, notes: string) => {
    // Currently adding note is handled in ResolveSingle, but if just adding a note:
    // We can use resolveSingleItem for now.
    resolveDispute(id, notes);
  }, [resolveDispute]);

  return {
    unmatched,
    matched,
    selectedIds,
    loading,
    fetchData,
    toggleSelect,
    selectAll,
    clearSelection,
    matchItems,
    resolveDispute,
    addNote,
  };
}

