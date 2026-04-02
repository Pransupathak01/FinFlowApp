import api from './api';
import { ReconItem, ReconStatus } from '../screens/Reconciliation/hooks/useReconciliation';

/**
 * Fetches reconciliation items based on status.
 */
export async function getReconciliationList(status: ReconStatus): Promise<ReconItem[]> {
  const resp = await api.get<{ success: boolean; data: any[] }>('/ft/reconciliation', {
    params: { status }
  });

  if (!resp.data.success) {
    throw new Error('Failed to fetch reconciliation records');
  }

  return resp.data.data.map(item => ({
    id: item._id,
    txTitle: item.txTitle,
    txAmount: item.txAmount,
    txDate: item.txDate,
    source: item.source,
    bankAmount: item.bankAmount,
    bankDate: item.bankDate,
    status: item.status,
    mismatchReason: item.mismatchReason,

    notes: item.notes,
  }));
}

/**
 * Batch resolve multiple reconciliation items.
 */
export async function batchMatchItems(ids: string[]): Promise<void> {
  const resp = await api.post<{ success: boolean }>('/ft/reconciliation/match-batch', { ids });
  if (!resp.data.success) {
    throw new Error('Failed to perform batch matching');
  }
}

/**
 * Resolve a single reconciliation item with notes.
 */
export async function resolveSingleItem(id: string, notes?: string): Promise<void> {
  const resp = await api.put<{ success: boolean }>(`/ft/reconciliation/${id}/resolve`, { notes });
  if (!resp.data.success) {
    throw new Error('Failed to resolve reconciliation item');
  }
}
