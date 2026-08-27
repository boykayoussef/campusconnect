import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, connectDB } from './config/db.js';

await connectDB();
const email='admin@campusconnect.local';
const password='Admin123!';
const hash=await bcrypt.hash(password,12);
const {rows}=await pool.query(`insert into users(name,email,password_hash,role,status) values($1,$2,$3,'admin','approved') on conflict(email) do update set password_hash=excluded.password_hash,role='admin',status='approved',updated_at=now() returning id`,['System Admin',email,hash]);
console.log(`Admin ready: ${email} / ${password} (${rows[0].id})`);
await pool.end();
