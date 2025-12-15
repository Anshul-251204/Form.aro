// lib/db.ts
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

/**
 * Global cached connection (for Next.js hot reload & serverless functions)
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    // Already connected – return existing connection
    return cached.conn;
  }

  if (!cached.promise) {
    // Creating a new connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "form", // optional database name
      })
      .then((mongoose) => {
        console.log("📦 Connected to MongoDB");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


const client = new MongoClient(MONGODB_URI);
export const clientPromise = client.connect();
 