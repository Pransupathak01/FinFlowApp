import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  title: string;
  amount: string;
  status: 'success' | 'failed' | 'pending';
  time: string;
  type: 'credit' | 'debit';
}

export interface DashboardData {
  todayTotal: number;
  weeklyTotal: number;
  todaySuccess: number;
  todayFailed: number;
  pendingReconciliation: number;
  chartData: { x: string; y: number; failed: number }[];
  recentActivity: Transaction[];
}

const MOCK_DATA: DashboardData = {
  todayTotal: 1284,
  weeklyTotal: 8732,
  todaySuccess: 1106,
  todayFailed: 178,
  pendingReconciliation: 43,
  chartData: [
    { x: 'Mon', y: 980, failed: 45 },
    { x: 'Tue', y: 1240, failed: 92 },
    { x: 'Wed', y: 870, failed: 30 },
    { x: 'Thu', y: 1560, failed: 110 },
    { x: 'Fri', y: 1100, failed: 67 },
    { x: 'Sat', y: 700, failed: 22 },
    { x: 'Sun', y: 1284, failed: 178 },
  ],
  recentActivity: [
    { id: '1', title: 'Payment from Acme Corp', amount: '+ ₹24,500', status: 'success', time: '2 min ago', type: 'credit' },
    { id: '2', title: 'Vendor payout - Suresh Traders', amount: '- ₹8,200', status: 'failed', time: '15 min ago', type: 'debit' },
    { id: '3', title: 'Salary disbursement', amount: '- ₹1,42,000', status: 'success', time: '1 hr ago', type: 'debit' },
    { id: '4', title: 'Refund - Order #4821', amount: '+ ₹3,750', status: 'pending', time: '2 hr ago', type: 'credit' },
    { id: '5', title: 'GST payment - Q1', amount: '- ₹67,400', status: 'success', time: '3 hr ago', type: 'debit' },
    { id: '6', title: 'Client deposit - TechVision', amount: '+ ₹95,000', status: 'success', time: '5 hr ago', type: 'credit' },
  ],
};

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 1200);
  };

  return { loading, data, refresh };
}
