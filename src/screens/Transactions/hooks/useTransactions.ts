import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTransactions, TransactionResponse } from '../../../services/transactionService';

export type TxStatus = 'success' | 'failed' | 'pending';
export type TxType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  status: TxStatus;
  type: TxType;
  date: string;
  dateLabel: string;
  category: string;
}

export interface FilterState {
  status: TxStatus | 'all';
  type: TxType | 'all';
  category: string;
  dateRange: 'today' | '7d' | '30d' | 'all';
}

export const DEFAULT_FILTER: FilterState = {
  status: 'all',
  type: 'all',
  category: 'all',
  dateRange: 'all',
};

const CATEGORIES = ['Payroll', 'Vendor', 'Tax', 'Refund', 'Client', 'Transfer', 'Utility'];

export function useTransactions() {
  const [query, setQuery]         = useState('');
  const [filters, setFilters]     = useState<FilterState>(DEFAULT_FILTER);
  const [loading, setLoading]     = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState<TransactionResponse['meta'] | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTransactions(query, filters);
      setTransactions(res.items);
      setMeta(res.meta);
    } catch (err) {
      console.error('[Transactions Error]', err);
    } finally {
      setLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.status   !== 'all') n++;
    if (filters.type     !== 'all') n++;
    if (filters.category !== 'all') n++;
    if (filters.dateRange !== 'all') n++;
    return n;
  }, [filters]);

  const updateFilters = useCallback((next: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTER), []);

  return {
    query, setQuery,
    filters, updateFilters, resetFilters,
    activeFilterCount,
    transactions,
    meta,
    loading,
    categories: CATEGORIES,
  };
}


