import { MongoClient, ServerApiVersion } from "mongodb";

const dbName = process.env.MONGODB_DB || "eco-verify";

let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set.");
  }

  if (cachedClient) return cachedClient;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(dbName);
}

