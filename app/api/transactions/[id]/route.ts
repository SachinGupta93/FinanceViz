import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { transactionSchema } from '@/lib/validations';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔍 [TRANSACTION GET] Request received for ID:', params.id);
  try {
    const db = await getDb();
    
    if (!ObjectId.isValid(params.id)) {
      console.log('❌ [TRANSACTION GET] Invalid ObjectId:', params.id);
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const transaction = await db
      .collection('transactions')
      .findOne({ _id: new ObjectId(params.id) });

    if (!transaction) {
      console.log('❌ [TRANSACTION GET] Transaction not found for ID:', params.id);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    console.log('🔍 [TRANSACTION GET] Found transaction:', JSON.stringify(transaction, null, 2));
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('❌ [TRANSACTION GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('✏️ [TRANSACTION PUT] Request received for ID:', params.id);
  try {
    const body = await request.json();
    console.log('✏️ [TRANSACTION PUT] Request body:', JSON.stringify(body, null, 2));
    
    const validatedData = transactionSchema.parse(body);
    console.log('✏️ [TRANSACTION PUT] Validated data:', JSON.stringify(validatedData, null, 2));

    const db = await getDb();
    
    if (!ObjectId.isValid(params.id)) {
      console.log('❌ [TRANSACTION PUT] Invalid ObjectId:', params.id);
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    console.log('✏️ [TRANSACTION PUT] Update data:', JSON.stringify(updateData, null, 2));

    const result = await db.collection('transactions').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    console.log('✏️ [TRANSACTION PUT] Update result:', result);

    if (result.matchedCount === 0) {
      console.log('❌ [TRANSACTION PUT] Transaction not found for ID:', params.id);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    console.log('✏️ [TRANSACTION PUT] Successfully updated transaction');
    return NextResponse.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('❌ [TRANSACTION PUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🗑️ [TRANSACTION DELETE] Request received for ID:', params.id);
  try {
    const db = await getDb();
    
    if (!ObjectId.isValid(params.id)) {
      console.log('❌ [TRANSACTION DELETE] Invalid ObjectId:', params.id);
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    const result = await db.collection('transactions').deleteOne({
      _id: new ObjectId(params.id)
    });

    console.log('🗑️ [TRANSACTION DELETE] Delete result:', result);

    if (result.deletedCount === 0) {
      console.log('❌ [TRANSACTION DELETE] Transaction not found for ID:', params.id);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    console.log('🗑️ [TRANSACTION DELETE] Successfully deleted transaction');
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('❌ [TRANSACTION DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}