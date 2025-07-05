import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  console.log('🧪 [TEST-MONGO GET] Request received');
  try {
    console.log('🧪 [TEST-MONGO GET] Attempting to connect to MongoDB...');
    const db = await getDb();
    console.log('🧪 [TEST-MONGO GET] Successfully connected to MongoDB');
    
    console.log('🧪 [TEST-MONGO GET] Listing collections...');
    const collections = await db.listCollections().toArray();
    console.log('🧪 [TEST-MONGO GET] Collections found:', collections.length);
    console.log('🧪 [TEST-MONGO GET] Collection names:', collections.map(c => c.name));
    
    const response = {
      message: 'MongoDB connection successful',
      collections: collections.map(c => c.name)
    };
    
    console.log('🧪 [TEST-MONGO GET] Response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ [TEST-MONGO GET] Error:', error);
    return NextResponse.json(
      { error: 'MongoDB connection failed', details: error },
      { status: 500 }
    );
  }
} 