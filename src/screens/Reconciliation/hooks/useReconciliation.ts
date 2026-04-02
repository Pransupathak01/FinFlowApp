import { useState, useMemo, useCallback } from 'react';

export type ReconStatus = 'unmatched' | 'matched' | 'disputed';

export interface ReconItem {
  id: string;
  txTitle: string;
  txAmount: number;
  txDate: string;
  source: string; // e.g. "HDFC Bank Statement"
  bankAmount: number;
  bankDate: string;
  status: ReconStatus;
  mismatchReason?: string;
  notes?: string;
}

const MOCK_DATA: ReconItem[] = [
  {
    id: 'r1',
    txTitle: 'Amazon Web Services',
    txAmount: 14500,
    txDate: '2026-03-28',
    source: 'ICICI Current A/c',
    bankAmount: 14500,
    bankDate: '2026-03-29',
    status: 'unmatched',
    mismatchReason: 'Date mismatch (1 day delay)',
  },
  {
    id: 'r2',
    txTitle: 'Vendor Payout - Suresh',
    txAmount: 8200,
    txDate: '2026-03-30',
    source: 'HDFC Statement #12',
    bankAmount: 8000,
    bankDate: '2026-03-30',
    status: 'unmatched',
    mismatchReason: 'Amount mismatch (Bank: ₹8,000, TX: ₹8,200)',
  },
  {
    id: 'r3',
    txTitle: 'Office Rent - April',
    txAmount: 50000,
    txDate: '2026-04-01',
    source: 'ICICI Current A/c',
    bankAmount: 50000,
    bankDate: '2026-04-01',
    status: 'matched',
  },
  {
    id: 'r4',
    txTitle: 'Client Payout - Acme',
    txAmount: 24500,
    txDate: '2026-03-31',
    source: 'Bank Feed #4',
    bankAmount: 24500,
    bankDate: '2026-03-31',
    status: 'unmatched',
  },
  {
    id: 'r5',
    txTitle: 'TDS Q4 Payment',
    txAmount: 45000,
    txDate: '2026-03-15',
    source: 'HDFC Statement #11',
    bankAmount: 45000,
    bankDate: '2026-03-15',
    status: 'matched',
    notes: 'Reconciled automatically by system',
  },
];

export function useReconciliation() {
  const [data, setData] = useState<ReconItem[]>(MOCK_DATA);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
  const matchItems = useCallback((ids: string[]) => {
    setData(prev => prev.map(item => 
      ids.includes(item.id) ? { ...item, status: 'matched', mismatchReason: undefined } : item
    ));
    setSelectedIds(new Set());
  }, []);

  const resolveDispute = useCallback((id: string, notes?: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'matched', notes, mismatchReason: undefined } : item
    ));
  }, []);

  const addNote = useCallback((id: string, notes: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, notes } : item
    ));
  }, []);

  return {
    unmatched,
    matched,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    matchItems,
    resolveDispute,
    addNote,
  };
}
