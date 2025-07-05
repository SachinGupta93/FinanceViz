import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Budget } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MONTHS } from '@/lib/constants';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BudgetForm } from './BudgetForm';

interface BudgetListProps {
  budgets: Budget[];
  loading: boolean;
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export function BudgetList({ budgets, loading, month, year, onMonthChange, onYearChange }: BudgetListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<any>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;
    await fetch(`/api/budgets?id=${id}`, { method: 'DELETE' });
    setRefreshFlag((f) => !f);
  };

  const handleEdit = (budget: any) => {
    setEditBudget(budget);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-gray-500">No budgets set for {MONTHS[month - 1]} {year}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Budgets for {MONTHS[month - 1]} {year}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <Card key={budget._id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">{budget.category}</CardTitle>
                <Badge variant="outline">{formatCurrency(budget.amount)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Spent: {formatCurrency(budget.spent ?? 0)}</span>
                  <span>{budget.percentage ?? 0}%</span>
                </div>
                <Progress value={budget.percentage ?? 0} className="h-2" />
                <div className="text-xs text-gray-500">
                  Remaining: {formatCurrency(budget.remaining ?? budget.amount)}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(budget)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => budget._id && handleDelete(budget._id)}>Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editBudget && (
            <BudgetForm
              month={editBudget.month}
              year={editBudget.year}
              initialValues={{
                _id: editBudget._id,
                category: editBudget.category,
                amount: editBudget.amount,
                month: editBudget.month,
                year: editBudget.year
              }}
              onSuccess={() => {
                setIsDialogOpen(false);
                setEditBudget(null);
                setRefreshFlag((f) => !f);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}