import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const options = { tls: true };

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Check if the URI is still a placeholder template
if (uri.includes('<username>') || uri.includes('<password>') || uri.includes('<cluster-name>')) {
  throw new Error(
    'MongoDB URI appears to be a placeholder template. Please configure a valid MongoDB connection string in .env.local. ' +
    'Either set up MongoDB Atlas (https://cloud.mongodb.com/) or install MongoDB locally.'
  );
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect().then((client) => {
    console.log('✅ Connected to MongoDB');
    return client;
  });
}
clientPromise = global._mongoClientPromise;

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db('personal-finance');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error(
      'Database connection failed. Please ensure MongoDB is running and the connection string is correct. ' +
      'Check your .env.local file and verify your MongoDB setup.'
    );
  }
}

export default clientPromise;
