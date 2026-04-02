import api from './api';
import { Transaction, FilterState } from '../screens/Transactions/hooks/useTransactions';

/**
 * Response interface for the paginated transaction API
 */
export interface TransactionResponse {
  items: Transaction[];
  meta: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    summary: {
      totalSuccess: number;
      totalFailed: number;
    };
  };
}

/**
 * Fetches transactions with optional filters, search query, and pagination.
 */
export async function getTransactions(
  query?: string,
  filters?: FilterState,
  page: number = 1
): Promise<TransactionResponse> {
  const params: any = {
    page,
    limit: 20,
  };
  if (query) params.q = query;
  if (filters?.status !== 'all') params.status = filters?.status;
  if (filters?.type   !== 'all') params.type   = filters?.type;
  if (filters?.category !== 'all') params.category = filters?.category;
  if (filters?.dateRange !== 'all') params.range = filters?.dateRange;

  const resp = await api.get<{ success: boolean; data: any }>('/ft/transactions', { params });

  if (!resp.data.success) {
    throw new Error('Failed to fetch transactions');
  }

  const { items, meta } = resp.data.data;

  // Use the pre-formatted txDate from backend while falling back locally if missing
  const formatDateLabel = (txDate: string) => {
    const d = new Date(txDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return {
    meta,
    items: items.map((tx: any) => ({
      id: tx._id,
      title: tx.title,
      subtitle: tx.description || tx.subtitle || '',
      amount: tx.amount,
      status: tx.status,
      type: tx.type,
      date: tx.createdAt || tx.date,
      dateLabel: formatDateLabel(tx.txDate || tx.date || tx.createdAt),
      category: tx.category || 'General',
    })),
  };
}

