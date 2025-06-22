import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Test the connection
    await db.admin().ping();
    
    return Response.json({ 
      status: 'Connected to MongoDB successfully!',
      database: db.databaseName 
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return Response.json({ 
      error: 'Failed to connect to MongoDB',
      details: error.message 
    }, { status: 500 });
  }
} 