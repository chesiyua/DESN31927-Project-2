import mongoose from 'mongoose';

let cachedPromise = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill it in.');
  }
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      cachedPromise = null; // allow a retry on the next request
      throw err;
    });
  }
  await cachedPromise;
  return mongoose.connection;
}
