import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusconnect';
  if (!uri) throw new Error('MongoDB connection string is not configured');
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected');
  return mongoose.connection;
}
