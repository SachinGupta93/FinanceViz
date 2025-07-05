import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { transactionSchema } from '@/lib/validations';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  console.log('🔍 [TRANSACTIONS GET] Request received');
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('🔍 [TRANSACTIONS GET] Query params:', { page, limit, category, startDate, endDate });

    const query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    console.log('🔍 [TRANSACTIONS GET] MongoDB query:', JSON.stringify(query, null, 2));

    const transactions = await db
      .collection('transactions')
      .find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await db.collection('transactions').countDocuments(query);

    console.log('🔍 [TRANSACTIONS GET] Found transactions:', transactions.length);
    console.log('🔍 [TRANSACTIONS GET] Total count:', total);
    console.log('🔍 [TRANSACTIONS GET] Sample transaction:', transactions[0]);

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ [TRANSACTIONS GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('➕ [TRANSACTIONS POST] Request received');
  try {
    const body = await request.json();
    console.log('➕ [TRANSACTIONS POST] Request body:', JSON.stringify(body, null, 2));
    
    const validatedData = transactionSchema.parse(body);
    console.log('➕ [TRANSACTIONS POST] Validated data:', JSON.stringify(validatedData, null, 2));

    const db = await getDb();
    const transaction = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('➕ [TRANSACTIONS POST] Transaction to insert:', JSON.stringify(transaction, null, 2));

    const result = await db.collection('transactions').insertOne(transaction);
    
    console.log('➕ [TRANSACTIONS POST] Insert result:', result);
    console.log('➕ [TRANSACTIONS POST] Inserted ID:', result.insertedId);
    
    const response = {
      ...transaction,
      _id: result.insertedId
    };
    
    console.log('➕ [TRANSACTIONS POST] Response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('❌ [TRANSACTIONS POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}