import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

const cached = (global as any).mongoose ?? { promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (mongoose.connection.readyState === 0) cached.promise = null;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  await cached.promise;
  return mongoose;
}