import mongoose from 'mongoose';

export interface MongoConnectionStatus {
  isConnected: boolean;
  state: 'connected' | 'connecting' | 'disconnected' | 'error';
  host?: string;
  dbName?: string;
  error?: string | null;
  isWhitelistError?: boolean;
  usingAtlas: boolean;
}

let connectionStatus: MongoConnectionStatus = {
  isConnected: false,
  state: 'disconnected',
  error: null,
  isWhitelistError: false,
  usingAtlas: false,
};

export const getConnectionStatus = (): MongoConnectionStatus => {
  const readyState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const isConn = readyState === 1;
  return {
    ...connectionStatus,
    isConnected: isConn,
    state: isConn ? 'connected' : readyState === 2 ? 'connecting' : connectionStatus.state,
    host: mongoose.connection.host || connectionStatus.host,
    dbName: mongoose.connection.name || connectionStatus.dbName,
  };
};

export const connectToMongo = async (uri?: string): Promise<MongoConnectionStatus> => {
  const mongoUri = uri || process.env.MONGODB_URI;

  if (
    !mongoUri ||
    mongoUri.includes('<username>') ||
    mongoUri.includes('<password>') ||
    mongoUri.includes('YOUR_')
  ) {
    console.log('[MongoDB] URI is unconfigured or contains placeholder values. Running Express API in fallback mode.');
    connectionStatus = {
      isConnected: false,
      state: 'disconnected',
      error: 'MONGODB_URI contains unconfigured placeholder values (<username>/<password>).',
      isWhitelistError: false,
      usingAtlas: false,
    };
    return connectionStatus;
  }

  try {
    connectionStatus.state = 'connecting';
    connectionStatus.error = null;
    connectionStatus.isWhitelistError = false;
    console.log('[MongoDB] Connecting to MongoDB Atlas...');

    // Disconnect existing if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect().catch(() => {});
    }

    let effectiveUri = mongoUri;
    if (effectiveUri.includes('.mongodb.net/?')) {
      effectiveUri = effectiveUri.replace('.mongodb.net/?', '.mongodb.net/taskmanager?');
    } else if (effectiveUri.includes('.mongodb.net/test?')) {
      effectiveUri = effectiveUri.replace('.mongodb.net/test?', '.mongodb.net/taskmanager?');
    }

    await mongoose.connect(effectiveUri, {
      dbName: 'taskmanager',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 8000,
    });

    const isAtlas = mongoUri.includes('mongodb+srv') || mongoUri.includes('mongodb.net');
    connectionStatus = {
      isConnected: true,
      state: 'connected',
      host: mongoose.connection.host,
      dbName: mongoose.connection.name,
      error: null,
      isWhitelistError: false,
      usingAtlas: isAtlas,
    };

    console.log(`[MongoDB] Connected successfully to ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'}! Database: ${mongoose.connection.name}`);
    return connectionStatus;
  } catch (err: any) {
    const rawMsg = err?.message || '';
    const isWhitelist =
      rawMsg.includes('whitelist') ||
      rawMsg.includes('Could not connect to any servers') ||
      rawMsg.includes('Server selection timed out') ||
      rawMsg.includes('SSL') ||
      rawMsg.includes('tlsv1 alert') ||
      rawMsg.includes('alert internal error');

    const friendlyMsg = isWhitelist
      ? "MongoDB Atlas cluster rejected connection: IP not whitelisted. In MongoDB Atlas, navigate to Network Access > Add IP Address and add '0.0.0.0/0' (Allow Access from Anywhere)."
      : rawMsg || 'Failed to connect to MongoDB cluster';

    console.warn(`[MongoDB] Notice: ${friendlyMsg}`);

    connectionStatus = {
      isConnected: false,
      state: 'error',
      error: friendlyMsg,
      isWhitelistError: isWhitelist,
      usingAtlas: Boolean(mongoUri?.includes('mongodb+srv') || mongoUri?.includes('mongodb.net')),
    };
    return connectionStatus;
  }
};

// Monitor mongoose connection events gracefully
mongoose.connection.on('connected', () => {
  connectionStatus.isConnected = true;
  connectionStatus.state = 'connected';
  connectionStatus.error = null;
  connectionStatus.isWhitelistError = false;
});

mongoose.connection.on('disconnected', () => {
  connectionStatus.isConnected = false;
  connectionStatus.state = 'disconnected';
});

mongoose.connection.on('error', (err) => {
  const rawMsg = err?.message || '';
  const isWhitelist =
    rawMsg.includes('whitelist') ||
    rawMsg.includes('Could not connect to any servers') ||
    rawMsg.includes('Server selection timed out') ||
    rawMsg.includes('SSL') ||
    rawMsg.includes('tlsv1 alert') ||
    rawMsg.includes('alert internal error');

  connectionStatus.isConnected = false;
  connectionStatus.state = 'error';
  connectionStatus.isWhitelistError = isWhitelist;
  connectionStatus.error = isWhitelist
    ? "MongoDB Atlas cluster rejected connection: IP not whitelisted. In MongoDB Atlas, navigate to Network Access > Add IP Address and add '0.0.0.0/0' (Allow Access from Anywhere)."
    : rawMsg;

  console.warn('[MongoDB] Connection event notice:', connectionStatus.error);
});
