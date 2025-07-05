import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = "force-dynamic";

export async function GET() {
  console.log('🔌 [CONNECTION-TEST] Testing MongoDB connection');
  
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('🔌 [CONNECTION-TEST] MONGODB_URI not defined');
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'MongoDB URI not defined in environment variables' 
        }, 
        { status: 500 }
      );
    }
    
    console.log('🔌 [CONNECTION-TEST] Connecting to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    console.log('🔌 [CONNECTION-TEST] Connected to MongoDB successfully');
    
    // Get database information
    const adminDb = client.db('admin');
    const databases = await adminDb.admin().listDatabases();
    
    // Get server information
    const serverInfo = await adminDb.admin().serverInfo();
    
    // Close the connection
    await client.close();
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      databases: databases.databases.map(db => db.name),
      serverVersion: serverInfo.version,
    });
    
  } catch (error) {
    console.error('🔌 [CONNECTION-TEST] Error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
