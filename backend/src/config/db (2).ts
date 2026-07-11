import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

/**
 * Connects to MongoDB database.
 * Falls back to an in-memory database in development if MONGODB_URI is absent or fails.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  // Set mongoose options for production stability
  mongoose.set('strictQuery', true);

  const isLocal = !uri || uri.includes('localhost') || uri.includes('127.0.0.1');

  if (!isLocal && uri) {
    try {
      console.log('🔌 Connecting to database:', uri.replace(/:([^@]+)@/, ':****@')); // Redact password
      await mongoose.connect(uri, {
        connectTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB Atlas successfully.');
      return;
    } catch (error) {
      console.error('❌ Failed to connect to MONGODB_URI. Falling back to in-memory database...', error);
    }
  }

  // Fallback to MongoMemoryServer (In-Memory Database) for safe local sandboxing
  try {
    console.log('💡 Initializing high-fidelity In-Memory MongoDB Server...');
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    
    await mongoose.connect(mongoUri);
    console.log(`✅ In-Memory MongoDB started and connected successfully.`);
    console.log(`🔗 Mock URI: ${mongoUri}`);
    console.log(`ℹ️ All timetable models will persist locally in RAM for your preview session.`);
  } catch (err) {
    console.error('❌ Critical error initializing In-Memory MongoDB:', err);
    process.exit(1);
  }
}

/**
 * Gracefully closes database connection.
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
    console.log('🔌 Database disconnected successfully.');
  } catch (error) {
    console.error('❌ Error during database disconnection:', error);
  }
}
