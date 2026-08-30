import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured');
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected');
  return mongoose.connection;
}
