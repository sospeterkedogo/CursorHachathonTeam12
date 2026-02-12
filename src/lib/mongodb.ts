import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "eco-verify";

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

let cachedClient: MongoClient | null = null;

export async function getMongoClient() {
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

