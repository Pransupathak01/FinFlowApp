import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export type TxStatus = 'success' | 'failed' | 'pending';
export type TxType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  status: TxStatus;
  type: TxType;
  date: string;       // ISO date string
  dateLabel: string;
  category: string;
}

export interface FilterState {
  status: TxStatus | 'all';
  type: TxType | 'all';
  category: string;   // 'all' or category name
  dateRange: 'today' | '7d' | '30d' | 'all';
}

export const DEFAULT_FILTER: FilterState = {
  status: 'all',
  type: 'all',
  category: 'all',
  dateRange: 'all',
};

// ── Mock Data ──────────────────────────────────────────────────────────────
const CATEGORIES = ['Payroll', 'Vendor', 'Tax', 'Refund', 'Client', 'Transfer', 'Utility'];

function makeDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

const RAW_TRANSACTIONS: Transaction[] = [
  { id: 't1',  title: 'Salary Disbursement',       subtitle: 'Payroll • 48 employees',         amount: 142000, status: 'success', type: 'debit',  date: makeDate(0),  dateLabel: formatDateLabel(makeDate(0)),  category: 'Payroll' },
  { id: 't2',  title: 'Payment from Acme Corp',     subtitle: 'Client deposit',                 amount: 24500,  status: 'success', type: 'credit', date: makeDate(0),  dateLabel: formatDateLabel(makeDate(0)),  category: 'Client' },
  { id: 't3',  title: 'Suresh Traders Payout',      subtitle: 'Vendor payment failed',          amount: 8200,   status: 'failed',  type: 'debit',  date: makeDate(0),  dateLabel: formatDateLabel(makeDate(0)),  category: 'Vendor' },
  { id: 't4',  title: 'Refund – Order #4821',       subtitle: 'Customer refund',                amount: 3750,   status: 'pending', type: 'credit', date: makeDate(1),  dateLabel: formatDateLabel(makeDate(1)),  category: 'Refund' },
  { id: 't5',  title: 'GST Q1 Payment',             subtitle: 'Tax payment',                    amount: 67400,  status: 'success', type: 'debit',  date: makeDate(1),  dateLabel: formatDateLabel(makeDate(1)),  category: 'Tax' },
  { id: 't6',  title: 'TechVision Deposit',         subtitle: 'Client advance',                 amount: 95000,  status: 'success', type: 'credit', date: makeDate(1),  dateLabel: formatDateLabel(makeDate(1)),  category: 'Client' },
  { id: 't7',  title: 'Electricity Bill',           subtitle: 'Utility payment',                amount: 12400,  status: 'success', type: 'debit',  date: makeDate(2),  dateLabel: formatDateLabel(makeDate(2)),  category: 'Utility' },
  { id: 't8',  title: 'BlueStar Vendor Payout',     subtitle: 'Vendor settlement',              amount: 34000,  status: 'failed',  type: 'debit',  date: makeDate(2),  dateLabel: formatDateLabel(makeDate(2)),  category: 'Vendor' },
  { id: 't9',  title: 'Office Rent Transfer',       subtitle: 'Internal transfer',              amount: 50000,  status: 'success', type: 'debit',  date: makeDate(3),  dateLabel: formatDateLabel(makeDate(3)),  category: 'Transfer' },
  { id: 't10', title: 'GlobalTech Receivable',      subtitle: 'Client payment – INV#9030',      amount: 180000, status: 'success', type: 'credit', date: makeDate(3),  dateLabel: formatDateLabel(makeDate(3)),  category: 'Client' },
  { id: 't11', title: 'Contractor Payout',          subtitle: 'Vendor payment',                 amount: 22000,  status: 'pending', type: 'debit',  date: makeDate(4),  dateLabel: formatDateLabel(makeDate(4)),  category: 'Vendor' },
  { id: 't12', title: 'TDS Deposit Q4',             subtitle: 'Tax compliance',                 amount: 45000,  status: 'success', type: 'debit',  date: makeDate(5),  dateLabel: formatDateLabel(makeDate(5)),  category: 'Tax' },
  { id: 't13', title: 'Bonus Payout',               subtitle: 'Payroll – Q4 bonus',             amount: 60000,  status: 'success', type: 'debit',  date: makeDate(6),  dateLabel: formatDateLabel(makeDate(6)),  category: 'Payroll' },
  { id: 't14', title: 'Return from Vendor',         subtitle: 'Refund received',                amount: 5500,   status: 'success', type: 'credit', date: makeDate(7),  dateLabel: formatDateLabel(makeDate(7)),  category: 'Refund' },
  { id: 't15', title: 'Internet Subscription',      subtitle: 'Utility – monthly',              amount: 4800,   status: 'failed',  type: 'debit',  date: makeDate(8),  dateLabel: formatDateLabel(makeDate(8)),  category: 'Utility' },
  { id: 't16', title: 'Inward Remittance',          subtitle: 'International client',           amount: 250000, status: 'success', type: 'credit', date: makeDate(10), dateLabel: formatDateLabel(makeDate(10)), category: 'Client' },
  { id: 't17', title: 'Advance Tax Payment',        subtitle: 'Tax – installment 3',            amount: 88000,  status: 'success', type: 'debit',  date: makeDate(12), dateLabel: formatDateLabel(makeDate(12)), category: 'Tax' },
  { id: 't18', title: 'Security Deposit Refund',    subtitle: 'Office lease refund',            amount: 100000, status: 'pending', type: 'credit', date: makeDate(15), dateLabel: makeDate(15).slice(0, 10),   category: 'Refund' },
  { id: 't19', title: 'Freelancer Payment',         subtitle: 'Vendor – design project',        amount: 15000,  status: 'success', type: 'debit',  date: makeDate(20), dateLabel: makeDate(20).slice(0, 10),   category: 'Vendor' },
  { id: 't20', title: 'Year-end Adjustment',        subtitle: 'Internal transfer',              amount: 320000, status: 'success', type: 'debit',  date: makeDate(28), dateLabel: makeDate(28).slice(0, 10),   category: 'Transfer' },
];

/** Map dateRange filter to daysAgo threshold */
function rangeDays(range: FilterState['dateRange']): number {
  if (range === 'today') return 0;
  if (range === '7d')    return 7;
  if (range === '30d')   return 30;
  return Infinity;
}

// ── Hook ─────────────────────────────────────────────────────────────────
export function useTransactions() {
  const [query, setQuery]         = useState('');
  const [filters, setFilters]     = useState<FilterState>(DEFAULT_FILTER);
  const [loading, setLoading]     = useState(true);
  const [allData]                 = useState<Transaction[]>(RAW_TRANSACTIONS);

  // Simulated initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Filtered + searched results (memoised)
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const maxDays = rangeDays(filters.dateRange);
    const now = Date.now();

    return allData.filter(tx => {
      if (filters.status !== 'all' && tx.status !== filters.status) return false;
      if (filters.type   !== 'all' && tx.type   !== filters.type)   return false;
      if (filters.category !== 'all' && tx.category !== filters.category) return false;
      if (maxDays !== Infinity) {
        const ageMs = now - new Date(tx.date).getTime();
        if (ageMs > maxDays * 86_400_000) return false;
      }
      if (q) {
        return (
          tx.title.toLowerCase().includes(q) ||
          tx.subtitle.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allData, query, filters]);

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
    transactions: filtered,
    loading,
    categories: CATEGORIES,
  };
}
