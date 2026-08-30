import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, connectDB } from './config/db.js';

await connectDB();

const email = process.env.ADMIN_EMAIL || 'admin@campusconnect.local';
const password = process.env.ADMIN_PASSWORD;

if (!password || password.length < 8) {
  console.error('Set ADMIN_PASSWORD (8+ characters) in backend/.env before running the admin seed.');
  await pool.end();
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const { rows } = await pool.query(
  `insert into users(name,email,password_hash,role,status)
   values($1,$2,$3,'admin','approved')
   on conflict(email) do update set password_hash=excluded.password_hash,
     role='admin', status='approved', updated_at=now()
   returning id`,
  [process.env.ADMIN_NAME || 'System Admin', email.toLowerCase(), hash]
);

console.log(`Admin ready: ${email} (${rows[0].id})`);
await pool.end();
