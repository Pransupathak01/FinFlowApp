import api from './api';
import { DashboardData } from '../screens/Dashboard/hooks/useDashboard';

/**
 * Fetches high-performance dashboard summary and recent activity.
 */
export async function getDashboardData(): Promise<DashboardData> {
  // Parallel fetching for performance
  const [summaryResp, recentResp] = await Promise.all([
    api.get<{ success: boolean; data: any }>('/ft/dashboard/summary'),
    api.get<{ success: boolean; data: any }>('/ft/dashboard/recent'),
  ]);

  if (!summaryResp.data.success || !recentResp.data.success) {
    throw new Error('Failed to fetch dashboard data');
  }

  const summary = summaryResp.data.data;
  const recent = recentResp.data.data;

  // Map to the DashboardData interface used by the hook
  return {
    todayTotal: summary.todayTotal,
    weeklyTotal: summary.weeklyTotal,
    todaySuccess: summary.todaySuccess,
    todayFailed: summary.todayFailed,
    pendingReconciliation: summary.pendingReconciliation,
    chartData: summary.chartData,
    recentActivity: recent.map((tx: any) => ({
      id: tx._id,
      title: tx.description || tx.title,
      amount: (tx.type === 'credit' ? '+ ' : '- ') + '₹' + tx.amount.toLocaleString(),
      status: tx.status,
      time: tx.timeLabel || 'Just now',
      type: tx.type,
    })),
  };
}
