import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import { connectDB } from './config/db.js';

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'System Admin';

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env');
  process.exit(1);
}

await connectDB();
const passwordHash = await bcrypt.hash(password, 12);
const user = await User.findOneAndUpdate(
  { email: email.toLowerCase() },
  { $set: { name, email: email.toLowerCase(), password: passwordHash, role: 'admin', status: 'approved' } },
  { upsert: true, new: true }
);

console.log(`Admin account ready: ${user.email}`);
await mongoose.disconnect();
