'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface BudgetComparisonChartProps {
  data: Array<{
    category: string;
    budget: number;
    spent: number;
    percentage: number;
    remaining: number;
  }>;
}

export function BudgetComparisonChart({ data }: BudgetComparisonChartProps) {
  console.log('📊 [BudgetComparisonChart] Component rendered with data:', JSON.stringify(data, null, 2));

  // Transform data for the chart
  const chartData = data.map(item => ({
    category: item.category,
    budget: Number(item.budget) || 0,
    spent: Number(item.spent) || 0,
    remaining: Number(item.remaining) || 0,
    percentage: Number(item.percentage) || 0
  }));

  console.log('📊 [BudgetComparisonChart] Formatted chart data:', JSON.stringify(chartData, null, 2));

  if (!chartData || chartData.length === 0) {
    console.log('📊 [BudgetComparisonChart] No data available, showing empty state');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No budget data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="category"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const budget = payload.find(p => p.dataKey === 'budget')?.value || 0;
                  const spent = payload.find(p => p.dataKey === 'spent')?.value || 0;
                  const remaining = payload.find(p => p.dataKey === 'remaining')?.value || 0;
                  const percentage = Math.round((spent / budget) * 100) || 0;
                  
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {label}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            Budget: ${budget}
                          </span>
                          <span className="font-bold text-red-500">
                            Spent: ${spent} ({percentage}%)
                          </span>
                          <span className="font-bold text-green-500">
                            Remaining: ${remaining}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="budget" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Budget" />
            <Bar dataKey="spent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Spent" />
            <Bar dataKey="remaining" fill="#10b981" radius={[4, 4, 0, 0]} name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}