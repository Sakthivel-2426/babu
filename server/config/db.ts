import mongoose from 'mongoose';
import { config } from './environment';
import { seedDatabaseIfEmpty } from '../utils/seedData';

export interface DatabaseStatus {
  connected: boolean;
  provider: string;
  host: string;
  dbName: string;
}

let dbStatus: DatabaseStatus = {
  connected: false,
  provider: 'Disconnected',
  host: '',
  dbName: '',
};

export async function connectDatabase(): Promise<DatabaseStatus> {
  const targetUri = config.mongoUri;

  try {
    console.log(`Connecting to MongoDB at: ${targetUri.replace(/:([^:@]{4})[^:@]*@/, ':$1***@')}`);

    // Try connecting with a 4-second server selection timeout
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 4000,
    });

    const conn = mongoose.connection;
    dbStatus = {
      connected: true,
      provider: 'MongoDB Database Server',
      host: conn.host,
      dbName: conn.name,
    };

    console.log(`✅ Connected to MongoDB (${dbStatus.host}/${dbStatus.dbName})`);
    await seedDatabaseIfEmpty();
    return dbStatus;
  } catch (error: any) {
    console.warn(`⚠️ Could not connect to MongoDB URI (${targetUri}): ${error.message}`);
    console.log('🔄 Initializing embedded MongoDB server for seamless zero-setup testing...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'babu-cinemas',
        },
      });

      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);

      const conn = mongoose.connection;
      dbStatus = {
        connected: true,
        provider: 'Embedded MongoDB (Zero-Setup Engine)',
        host: conn.host,
        dbName: conn.name,
      };

      console.log(`✅ Connected to Embedded MongoDB at ${memoryUri}`);
      await seedDatabaseIfEmpty();
      return dbStatus;
    } catch (memErr: any) {
      console.error('❌ Failed to start embedded MongoDB:', memErr.message);
      throw memErr;
    }
  }
}

export function getDatabaseStatus(): DatabaseStatus {
  return dbStatus;
}
