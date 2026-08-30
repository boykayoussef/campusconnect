import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePicture: user.profilePicture,
  bio: user.bio,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt
});

const createToken = (user) => jwt.sign(
  { id: user._id.toString(), role: user.role, status: user.status },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
);

export async function register(req, res, next) {
  try {
    const { name, email, password, profilePicture = '', bio = '', role = 'student' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    if (!['student', 'clubLeader'].includes(role)) return res.status(400).json({ success: false, message: 'Invalid registration role' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

    const normalizedEmail = String(email).trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      profilePicture,
      bio,
      role,
      status: role === 'clubLeader' ? 'pending' : undefined
    });

    res.status(201).json({ success: true, user: safeUser(user), token: createToken(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({ success: true, user: safeUser(user), token: createToken(user) });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: safeUser(user) });
  } catch (error) {
    next(error);
  }
}
