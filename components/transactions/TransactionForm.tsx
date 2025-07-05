'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transactionSchema, TransactionFormData } from '@/lib/validations';
import { CATEGORIES } from '@/lib/constants';
import { Transaction, Budget } from '@/types';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSuccess: () => void;
}

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  console.log('📝 [TransactionForm] Component rendered with transaction:', JSON.stringify(transaction, null, 2));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction ? {
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: format(new Date(transaction.date), 'yyyy-MM-dd') as string,
      budgetId: transaction.budgetId || ''
    } : {
      date: format(new Date(), 'yyyy-MM-dd') as string
    }
  });

  const category = watch('category');
  const date = watch('date');
  const selectedBudgetId = watch('budgetId');

  console.log('📝 [TransactionForm] Selected category:', category);
  console.log('📝 [TransactionForm] Selected budget ID:', selectedBudgetId);

  // Fetch budgets when category or date changes
  useEffect(() => {
    if (category && date) {
      fetchBudgets(category, date);
    }
  }, [category, date]);

  const fetchBudgets = async (selectedCategory: string, selectedDate: string) => {
    console.log('📝 [TransactionForm] Fetching budgets...');
    try {
      const dateObj = new Date(selectedDate);
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      
      console.log('📝 [TransactionForm] Fetching budgets for month:', month, 'year:', year);
      
      const response = await fetch(`/api/budgets?category=${selectedCategory}&month=${month}&year=${year}`);
      if (response.ok) {
        const data = await response.json();
        setBudgets(data.budgets || []);
        console.log('📝 [TransactionForm] Set budgets:', JSON.stringify(data.budgets, null, 2));
      }
    } catch (error) {
      console.error('📝 [TransactionForm] Error fetching budgets:', error);
    }
  };

  // Filter budgets by selected category
  const availableBudgets = budgets.filter(budget => budget.category === category);
  
  console.log('📝 [TransactionForm] Available budgets for category:', category, JSON.stringify(availableBudgets, null, 2));

  const onSubmit = async (data: TransactionFormData) => {
    console.log('📝 [TransactionForm] Form submitted with data:', JSON.stringify(data, null, 2));
    setLoading(true);
    setError(null);

    if (availableBudgets.length > 0 && !data.budgetId) {
      setError('Budget selection is required.');
      setLoading(false);
      return;
    }

    try {
      const url = transaction ? `/api/transactions/${transaction._id}` : '/api/transactions';
      const method = transaction ? 'PUT' : 'POST';
      
      console.log('📝 [TransactionForm] Making request to:', url, 'with method:', method);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📝 [TransactionForm] Response status:', response.status);
      
      const result = await response.json();
      console.log('📝 [TransactionForm] Response data:', JSON.stringify(result, null, 2));

      if (response.ok) {
        toast({
          title: transaction ? 'Transaction updated' : 'Transaction added',
          description: transaction ? 'Transaction has been updated successfully.' : 'Transaction has been added successfully.',
        });
        
        // Reset form
        if (!transaction) {
          setValue('amount', 0);
          setValue('description', '');
          setValue('category', '');
          setValue('date', format(new Date(), 'yyyy-MM-dd'));
          setValue('budgetId', '');
        }
        
        onSuccess();
      } else {
        throw new Error(result.error || 'Failed to save transaction');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save transaction',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                console.log('📝 [TransactionForm] Category changed to:', value);
                setValue('category', value);
                setValue('budgetId', ''); // Reset budget selection when category changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {category && availableBudgets.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="budgetId">Budget</Label>
              <Select
                value={selectedBudgetId}
                onValueChange={(value) => {
                  console.log('📝 [TransactionForm] Budget changed to:', value);
                  setValue('budgetId', value);
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget to link" />
                </SelectTrigger>
                <SelectContent>
                  {availableBudgets.map((budget) => (
                    <SelectItem key={budget._id} value={budget._id || ''}>
                      {budget.category} - ${budget.amount} (${budget.remaining || budget.amount} remaining)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budgetId && (
                <p className="text-red-600 text-sm mt-1">Budget selection is required.</p>
              )}
              <p className="text-sm text-muted-foreground">
                You must select a budget for this transaction.
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : transaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}