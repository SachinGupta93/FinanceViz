'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecentTransactionsProps {
  transactions: Array<{
    _id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
  }>;
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  console.log('📊 [RecentTransactions] Component rendered with transactions:', JSON.stringify(transactions, null, 2));

  if (!transactions || transactions.length === 0) {
    console.log('📊 [RecentTransactions] No transactions available, showing empty state');
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent transactions
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('📊 [RecentTransactions] Rendering', transactions.length, 'transactions');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => {
            console.log('📊 [RecentTransactions] Rendering transaction:', JSON.stringify(transaction, null, 2));
            
            return (
              <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{transaction.category}</Badge>
                  <span className="font-bold text-red-600">
                    -${transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}