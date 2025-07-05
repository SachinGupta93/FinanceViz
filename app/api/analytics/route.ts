import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { MONTHS } from '@/lib/constants';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  console.log('📊 [ANALYTICS GET] Request received');
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    console.log('📊 [ANALYTICS GET] Query params:', { month, year });

    // Create date strings for the current month (YYYY-MM-DD format)
    const startDateStr = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDateStr = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate().toString().padStart(2, '0')}`;
    
    console.log('📊 [ANALYTICS GET] Date range:', { startDateStr, endDateStr });
    
    // For date range queries, we'll use string comparison since dates are stored as strings
    const totalExpensesResult = await db.collection('transactions').aggregate([
      {
        $match: {
          date: { $gte: startDateStr, $lte: endDateStr }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]).toArray();

    const totalExpenses = totalExpensesResult[0]?.total || 0;
    console.log('📊 [ANALYTICS GET] Total expenses:', totalExpenses);

    // For monthly expenses, get the last 6 months of data
    const monthlyExpensesData = [];
    
    // Generate last 6 months including current month
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(year, month - 1 - i, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1;
      
      const monthStart = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`;
      const monthEnd = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-${new Date(targetYear, targetMonth, 0).getDate().toString().padStart(2, '0')}`;
      
      console.log('📊 [ANALYTICS GET] Checking month:', { targetYear, targetMonth, monthStart, monthEnd });
      
      const monthExpenses = await db.collection('transactions').aggregate([
        {
          $match: {
            date: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]).toArray();
      
      const amount = monthExpenses[0]?.total || 0;
      
      monthlyExpensesData.push({
        month: `${MONTHS[targetMonth - 1]} ${targetYear}`,
        amount: amount
      });
    }

    console.log('📊 [ANALYTICS GET] Monthly expenses data:', JSON.stringify(monthlyExpensesData, null, 2));

    const formattedMonthlyExpenses = monthlyExpensesData;

    console.log('📊 [ANALYTICS GET] Formatted monthly expenses:', JSON.stringify(formattedMonthlyExpenses, null, 2));

    const categoryBreakdown = await db.collection('transactions').aggregate([
      {
        $match: {
          date: { $gte: startDateStr, $lte: endDateStr }
        }
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' }
        }
      }
    ]).toArray();

    console.log('📊 [ANALYTICS GET] Category breakdown raw:', JSON.stringify(categoryBreakdown, null, 2));

    const formattedCategoryBreakdown = categoryBreakdown.map(item => ({
      category: item._id,
      amount: item.amount,
      percentage: totalExpenses > 0 ? Math.round((item.amount / totalExpenses) * 100) : 0
    }));

    console.log('📊 [ANALYTICS GET] Formatted category breakdown:', JSON.stringify(formattedCategoryBreakdown, null, 2));

    const recentTransactions = await db.collection('transactions')
      .find({})
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    console.log('📊 [ANALYTICS GET] Recent transactions:', JSON.stringify(recentTransactions, null, 2));

    const budgets = await db.collection('budgets')
      .find({ month, year })
      .toArray();

    console.log('📊 [ANALYTICS GET] Budgets found:', JSON.stringify(budgets, null, 2));

    const budgetComparison = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await db.collection('transactions').aggregate([
          {
            $match: {
              category: budget.category,
              date: { $gte: startDateStr, $lte: endDateStr }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]).toArray();

        const spentAmount = spent[0]?.total || 0;
        const percentage = budget.amount > 0 ? Math.round((spentAmount / budget.amount) * 100) : 0;
        
        const comparison = {
          category: budget.category,
          budget: budget.amount,
          spent: spentAmount,
          percentage: percentage,
          remaining: budget.amount - spentAmount
        };
        
        console.log(`📊 [ANALYTICS GET] Budget comparison for ${budget.category}:`, JSON.stringify(comparison, null, 2));
        
        return comparison;
      })
    );

    const response = {
      totalExpenses,
      monthlyExpenses: formattedMonthlyExpenses,
      categoryBreakdown: formattedCategoryBreakdown,
      recentTransactions,
      budgetComparison
    };

    console.log('📊 [ANALYTICS GET] Final response:', JSON.stringify(response, null, 2));

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ [ANALYTICS GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}