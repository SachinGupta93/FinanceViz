export interface Transaction {
  _id?: string;
  amount: number;
  description: string;
  category: string;
  date: string; // Changed to string for consistency
  budgetId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  spent?: number;
  remaining?: number;
  percentage?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardData {
  totalExpenses: number;
  monthlyExpenses: Array<{
    month: string;
    amount: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Transaction[];
  budgetComparison: Array<{
    category: string;
    budget: number;
    spent: number;
    percentage: number;
    remaining: number;
  }>;
}

export interface MonthlyData {
  month: string;
  amount: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  color: string;
}