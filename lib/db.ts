// // lib/db.ts
// import { MongoClient } from "mongodb";
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error("❌ MONGODB_URI is not defined in environment variables");
// }

// /**
//  * Global cached connection (for Next.js hot reload & serverless functions)
//  */
// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// export async function connectDB() {
//   if (cached.conn) {
//     // Already connected – return existing connection
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     // Creating a new connection promise
//     cached.promise = mongoose
//       .connect(MONGODB_URI, {
//         dbName: "form", // optional database name
//       })
//       .then((mongoose) => {
//         console.log("📦 Connected to MongoDB");
//         return mongoose;
//       })
//       .catch((err) => {
//         console.error("❌ MongoDB connection error:", err);
//         throw err;
//       });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }


// const client = new MongoClient(MONGODB_URI);
// export const clientPromise = client.connect();


import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = global as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache =
  globalForMongoose.mongoose ?? { conn: null, promise: null };

globalForMongoose.mongoose = cached;

export async function connectDB() {
  // ✅ already connected
  if (cached.conn) {
    return cached.conn;
  }

  // ❗ read env ONLY when function is called
  const uri = process.env.MONGODB_URI;
  if (!process.env.MONGODB_URI && process.env.NODE_ENV !== "production") {
    throw new Error("MONGODB_URI missing");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri!, {
      dbName: "form",
    });
  }

  cached.conn = await cached.promise;
  console.log("📦 MongoDB connected");

  return cached.conn;
}

