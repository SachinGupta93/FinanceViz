'use client';

import { useState, useEffect } from 'react';
import { BudgetForm } from '@/components/budgets/BudgetForm';
import { BudgetList } from '@/components/budgets/BudgetList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Budget } from '@/types';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchBudgets();
  }, [currentMonth, currentYear]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/budgets?month=${currentMonth}&year=${currentYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      const result = await response.json();
      setBudgets(result.budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSuccess = () => {
    setIsDialogOpen(false);
    fetchBudgets();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Set and track your spending limits</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm
              month={currentMonth}
              year={currentYear}
              onSuccess={handleBudgetSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <BudgetList
        budgets={budgets}
        loading={loading}
        month={currentMonth}
        year={currentYear}
        onMonthChange={setCurrentMonth}
        onYearChange={setCurrentYear}
      />
    </div>
  );
}