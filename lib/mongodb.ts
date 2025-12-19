import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // ⚠️ IMPORTANT: do NOT throw during build
  // Only throw when actually used
  console.warn("⚠️ MONGODB_URI not set yet");
}

const globalForMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClientPromise() {
  if (!uri) {
    // throw new Error("MONGODB_URI is required at runtime");
    console.warn("Mongodb env variable not present ❌")
    return null
  }

  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri as string);
    globalForMongo._mongoClientPromise = client.connect();
  }

  return globalForMongo._mongoClientPromise;
}
