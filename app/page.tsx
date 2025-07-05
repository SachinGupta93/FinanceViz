'use client';

import { useEffect, useState } from 'react';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { MonthlyExpenseChart } from '@/components/dashboard/MonthlyExpenseChart';
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart';
import { BudgetComparisonChart } from '@/components/dashboard/BudgetComparisonChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

export default function Dashboard() {
  console.log('🏠 [Dashboard] Component rendered');
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    console.log('🏠 [Dashboard] Fetching analytics data...');
    try {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      console.log('🏠 [Dashboard] Fetching for month:', month, 'year:', year);
      
      const response = await fetch(`/api/analytics?month=${month}&year=${year}`);
      console.log('🏠 [Dashboard] Analytics response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const data = await response.json();
      console.log('🏠 [Dashboard] Analytics data received:', JSON.stringify(data, null, 2));
      
      setAnalytics(data);
    } catch (err) {
      console.error('🏠 [Dashboard] Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    console.log('🏠 [Dashboard] Loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('🏠 [Dashboard] Error state:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('🏠 [Dashboard] Rendering dashboard with analytics:', JSON.stringify(analytics, null, 2));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <DashboardCards analytics={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyExpenseChart data={analytics?.monthlyExpenses || []} loading={loading} />
        <CategoryPieChart data={analytics?.categoryBreakdown || []} />
      </div>

      <BudgetComparisonChart data={analytics?.budgetComparison || []} />

      <RecentTransactions transactions={analytics?.recentTransactions || []} />
    </div>
  );
}