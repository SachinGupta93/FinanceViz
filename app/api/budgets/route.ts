import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { budgetSchema } from '@/lib/validations';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  console.log('🔍 [BUDGETS GET] Request received');
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const category = searchParams.get('category');

    console.log('🔍 [BUDGETS GET] Query params:', { month, year, category });

    const query = { month, year };
    if (category) {
      query.category = category;
    }

    console.log('🔍 [BUDGETS GET] MongoDB query:', JSON.stringify(query, null, 2));

    const budgets = await db
      .collection('budgets')
      .find(query)
      .toArray();

    // For each budget, calculate spent, remaining, and percentage
    const startDateStr = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDateStr = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate().toString().padStart(2, '0')}`;

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const spentAgg = await db.collection('transactions').aggregate([
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
        const spent = spentAgg[0]?.total || 0;
        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
        return {
          ...budget,
          spent,
          remaining,
          percentage
        };
      })
    );

    console.log('🔍 [BUDGETS GET] Budgets with spending:', JSON.stringify(budgetsWithSpending, null, 2));

    return NextResponse.json({ budgets: budgetsWithSpending });
  } catch (error) {
    console.error('❌ [BUDGETS GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('➕ [BUDGETS POST] Request received');
  try {
    const body = await request.json();
    console.log('➕ [BUDGETS POST] Request body:', JSON.stringify(body, null, 2));
    
    const validatedData = budgetSchema.parse(body);
    console.log('➕ [BUDGETS POST] Validated data:', JSON.stringify(validatedData, null, 2));

    const db = await getDb();
    
    const updateData = {
      ...validatedData,
      updatedAt: new Date()
    };

    console.log('➕ [BUDGETS POST] Update data:', JSON.stringify(updateData, null, 2));
    
    const result = await db.collection('budgets').updateOne(
      {
        category: validatedData.category,
        month: validatedData.month,
        year: validatedData.year
      },
      {
        $set: updateData,
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('➕ [BUDGETS POST] Update result:', result);
    console.log('➕ [BUDGETS POST] Upserted ID:', result.upsertedId);

    return NextResponse.json({ message: 'Budget saved successfully' });
  } catch (error) {
    console.error('❌ [BUDGETS POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save budget' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing budget id' }, { status: 400 });
    }
    const result = await db.collection('budgets').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('❌ [BUDGETS DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}