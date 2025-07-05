'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface DashboardCardsProps {
  analytics: any;
}

export function DashboardCards({ analytics }: DashboardCardsProps) {
  console.log('📊 [DashboardCards] Component rendered with analytics:', JSON.stringify(analytics, null, 2));

  if (!analytics) {
    console.log('📊 [DashboardCards] No analytics data available');
    return null;
  }

  const totalExpenses = analytics.totalExpenses || 0;
  const budgetComparison = analytics.budgetComparison || [];
  
  // Calculate total budget and total spent
  const totalBudget = budgetComparison.reduce((sum: number, item: any) => sum + (item.budget || 0), 0);
  const totalSpent = budgetComparison.reduce((sum: number, item: any) => sum + (item.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  console.log('📊 [DashboardCards] Calculated values:', {
    totalExpenses,
    totalBudget,
    totalSpent,
    totalRemaining,
    overallPercentage
  });

  // Get the most recent month's data for trend calculation
  const monthlyExpenses = analytics.monthlyExpenses || [];
  const currentMonthAmount = monthlyExpenses.length > 0 ? monthlyExpenses[monthlyExpenses.length - 1].amount : 0;
  const previousMonthAmount = monthlyExpenses.length > 1 ? monthlyExpenses[monthlyExpenses.length - 2].amount : 0;
  
  const trendPercentage = previousMonthAmount > 0 
    ? Math.round(((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100)
    : 0;

  console.log('📊 [DashboardCards] Trend calculation:', {
    currentMonthAmount,
    previousMonthAmount,
    trendPercentage
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {trendPercentage > 0 ? '+' : ''}{trendPercentage}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Across {budgetComparison.length} categories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallPercentage}%</div>
          <p className="text-xs text-muted-foreground">
            ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalRemaining.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalRemaining >= 0 ? 'Under budget' : 'Over budget'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}