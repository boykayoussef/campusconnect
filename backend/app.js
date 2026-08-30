import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { pool } from './config/db.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) console.warn('JWT_SECRET is not configured. Set it in backend/.env before production.');

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  status: u.status,
  bio: u.bio || '',
  profilePicture: u.profile_picture || ''
});

const signToken = (u) => jwt.sign(
  { id: u.id, role: u.role },
  JWT_SECRET || 'local-development-secret',
  { expiresIn: '7d' }
);

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET || 'local-development-secret');
    const { rows } = await pool.query('select * from users where id = $1', [payload.id]);
    if (!rows[0]) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = rows[0];
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You do not have permission for this action' });
  }
  return next();
};

const requireApprovedLeader = (req, res, next) => {
  if (req.user.role !== 'clubLeader' || req.user.status !== 'approved') {
    return res.status(403).json({ success: false, message: 'Club leader approval is required' });
  }
  return next();
};

const isValidDate = (value) => !Number.isNaN(new Date(value).getTime());
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizeRequirements = (requirements) => Array.isArray(requirements)
  ? requirements.map(String).map((x) => x.trim()).filter(Boolean).slice(0, 20)
  : [];

const allowedTypes = new Set(['workshop', 'social', 'competition', 'volunteering', 'other']);
const allowedStatuses = new Set(['open', 'closed']);
const allowedUserStatuses = new Set(['pending', 'approved', 'rejected']);
const allowedRoles = new Set(['student', 'clubLeader', 'admin']);
const allowedRegistrationStatuses = new Set(['pending', 'confirmed', 'cancelled']);

function classifyEvent(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  if (/ai|software|coding|hack|technology|program/.test(text)) return 'Technology';
  if (/career|startup|internship|business|job/.test(text)) return 'Career';
  if (/sport|football|basketball|fitness/.test(text)) return 'Sports';
  if (/volunteer|community|service/.test(text)) return 'Volunteering';
  if (/art|design|photo|music|creative/.test(text)) return 'Arts';
  if (/study|academic|lecture|research|exam/.test(text)) return 'Academic';
  return 'Other';
}

async function aiCategory(title, description) {
  if (process.env.HUGGINGFACE_API_KEY) {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
        {
          inputs: `${title}. ${description}`,
          parameters: {
            candidate_labels: ['Technology', 'Career', 'Sports', 'Volunteering', 'Arts', 'Academic', 'Other']
          }
        },
        {
          headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
          timeout: 8000
        }
      );
      if (response.data?.labels?.[0]) return response.data.labels[0];
    } catch (error) {
      console.warn('AI classification unavailable; using deterministic fallback.');
    }
  }
  return classifyEvent(title, description);
}

async function getEvent(id, { includeClosed = true } = {}) {
  const { rows } = await pool.query(
    `select e.*, u.name as creator_name, u.email as creator_email,
            coalesce(c.registered_count, 0)::int as registered_count,
            coalesce(c.remaining_slots, e.total_slots)::int as remaining_slots
       from events e
       join users u on u.id = e.created_by
       left join event_capacity c on c.id = e.id
      where e.id = $1 ${includeClosed ? '' : "and e.status = 'open'"}`,
    [id]
  );
  return rows[0] || null;
}

app.get('/api/health', asyncHandler(async (req, res) => {
  await pool.query('select 1');
  res.json({ success: true, message: 'CampusConnect API is running', database: 'connected' });
}));

// Authentication
app.post('/api/auth/register', asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');
  const role = req.body.role || 'student';

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required' });
  }
  if (name.length > 120 || email.length > 255) {
    return res.status(400).json({ success: false, message: 'Name or email is too long' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }
  if (!['student', 'clubLeader'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid registration role' });
  }

  const exists = await pool.query('select id from users where lower(email) = lower($1)', [email]);
  if (exists.rows[0]) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const status = role === 'clubLeader' ? 'pending' : 'approved';
  const { rows } = await pool.query(
    `insert into users(name, email, password_hash, role, status)
     values($1, $2, $3, $4, $5) returning *`,
    [name, email, passwordHash, role, status]
  );

  res.status(201).json({ success: true, user: publicUser(rows[0]), token: signToken(rows[0]) });
}));

app.post('/api/auth/login', asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');
  const { rows } = await pool.query('select * from users where lower(email) = lower($1)', [email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({ success: true, user: publicUser(user), token: signToken(user) });
}));

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

// Users / RBAC
app.get('/api/users/profile', requireAuth, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

app.put('/api/users/profile', requireAuth, asyncHandler(async (req, res) => {
  const name = req.body.name === undefined ? null : String(req.body.name).trim();
  const bio = req.body.bio === undefined ? null : String(req.body.bio);
  const profilePicture = req.body.profilePicture === undefined ? null : String(req.body.profilePicture);

  if (name !== null && !name) return res.status(400).json({ success: false, message: 'Name cannot be empty' });
  if (name?.length > 120) return res.status(400).json({ success: false, message: 'Name is too long' });

  const { rows } = await pool.query(
    `update users
        set name = coalesce($1, name), bio = coalesce($2, bio),
            profile_picture = coalesce($3, profile_picture), updated_at = now()
      where id = $4 returning *`,
    [name, bio, profilePicture, req.user.id]
  );
  res.json({ success: true, user: publicUser(rows[0]) });
}));

app.get('/api/users', requireAuth, allowRoles('admin'), asyncHandler(async (req, res) => {
  const { role, status } = req.query;
  const params = [];
  const where = [];
  if (role) { params.push(role); where.push(`role = $${params.length}`); }
  if (status) { params.push(status); where.push(`status = $${params.length}`); }
  const { rows } = await pool.query(
    `select * from users ${where.length ? `where ${where.join(' and ')}` : ''} order by created_at desc`,
    params
  );
  res.json({ success: true, users: rows.map(publicUser) });
}));

async function changeUserStatus(req, res) {
  const status = req.body.status;
  if (!allowedUserStatuses.has(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
  const { rows } = await pool.query(
    `update users set status = $1, updated_at = now() where id = $2 returning *`,
    [status, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: publicUser(rows[0]) });
}

async function changeUserRole(req, res) {
  const role = req.body.role;
  if (!allowedRoles.has(role)) return res.status(400).json({ success: false, message: 'Invalid role' });
  const status = role === 'clubLeader' ? 'approved' : 'approved';
  const { rows } = await pool.query(
    `update users set role = $1, status = $2, updated_at = now() where id = $3 returning *`,
    [role, status, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: publicUser(rows[0]) });
}

app.put('/api/users/:id/status', requireAuth, allowRoles('admin'), asyncHandler(changeUserStatus));
app.patch('/api/users/:id/status', requireAuth, allowRoles('admin'), asyncHandler(changeUserStatus));
app.put('/api/users/:id/role', requireAuth, allowRoles('admin'), asyncHandler(changeUserRole));
app.patch('/api/users/:id/role', requireAuth, allowRoles('admin'), asyncHandler(changeUserRole));

// Events
app.get('/api/events', asyncHandler(async (req, res) => {
  const { search, category, type, status = 'open' } = req.query;
  const params = [];
  const where = ["((u.role = 'clubLeader' and u.status = 'approved') or u.role = 'admin')"];

  if (status) { params.push(status); where.push(`e.status = $${params.length}`); }
  if (category) { params.push(category); where.push(`e.category = $${params.length}`); }
  if (type) { params.push(type); where.push(`lower(e.type) = lower($${params.length})`); }
  if (search) {
    params.push(`%${String(search).trim()}%`);
    where.push(`(e.title ilike $${params.length} or e.description ilike $${params.length} or e.club ilike $${params.length})`);
  }

  const { rows } = await pool.query(
    `select e.*, u.name as creator_name,
            coalesce(c.registered_count, 0)::int as registered_count,
            coalesce(c.remaining_slots, e.total_slots)::int as remaining_slots
       from events e
       join users u on u.id = e.created_by
       left join event_capacity c on c.id = e.id
      where ${where.join(' and ')}
      order by e.event_date asc`,
    params
  );
  res.json({ success: true, events: rows });
}));

app.get('/api/events/:id', asyncHandler(async (req, res) => {
  const event = await getEvent(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
  res.json({ success: true, event, remainingSlots: event.remaining_slots });
}));

app.get('/api/events/my/created', requireAuth, allowRoles('clubLeader', 'admin'), asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `select e.*, coalesce(c.registered_count, 0)::int as registered_count,
            coalesce(c.remaining_slots, e.total_slots)::int as remaining_slots
       from events e left join event_capacity c on c.id = e.id
      where e.created_by = $1 order by e.event_date asc`,
    [req.user.id]
  );
  res.json({ success: true, events: rows });
}));
app.get('/api/events/mine', requireAuth, allowRoles('clubLeader', 'admin'), asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `select e.*, coalesce(c.registered_count, 0)::int as registered_count,
            coalesce(c.remaining_slots, e.total_slots)::int as remaining_slots
       from events e left join event_capacity c on c.id = e.id
      where e.created_by = $1 order by e.event_date asc`,
    [req.user.id]
  );
  res.json({ success: true, events: rows });
}));

app.post('/api/events', requireAuth, allowRoles('clubLeader'), requireApprovedLeader, asyncHandler(async (req, res) => {
  const title = String(req.body.title || '').trim();
  const club = String(req.body.club || '').trim();
  const description = String(req.body.description || '').trim();
  const location = String(req.body.location || '').trim();
  const eventDate = req.body.eventDate;
  const type = String(req.body.type || '').trim().toLowerCase();
  const requirements = normalizeRequirements(req.body.requirements);
  const totalSlots = Number(req.body.totalSlots ?? 50);

  if (!title || !club || !description || !location || !eventDate || !type) {
    return res.status(400).json({ success: false, message: 'Title, club, description, location, date and type are required' });
  }
  if (!isValidDate(eventDate) || new Date(eventDate) <= new Date()) {
    return res.status(400).json({ success: false, message: 'Event date must be in the future' });
  }
  if (!allowedTypes.has(type)) return res.status(400).json({ success: false, message: 'Invalid event type' });
  if (!Number.isInteger(totalSlots) || totalSlots < 1 || totalSlots > 100000) {
    return res.status(400).json({ success: false, message: 'Capacity must be a positive whole number' });
  }

  const category = await aiCategory(title, description);
  const { rows } = await pool.query(
    `insert into events(title, club, description, requirements, location, event_date, type, category, total_slots, status, created_by)
     values($1,$2,$3,$4,$5,$6,$7,$8,$9,'open',$10) returning *`,
    [title, club, description, requirements, location, eventDate, type, category, totalSlots, req.user.id]
  );
  res.status(201).json({ success: true, event: rows[0] });
}));

async function updateEvent(req, res) {
  const event = await getEvent(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
  if (req.user.role !== 'admin' && String(event.created_by) !== String(req.user.id)) {
    return res.status(403).json({ success: false, message: 'You do not own this event' });
  }

  const nextDate = req.body.eventDate === undefined ? event.event_date : req.body.eventDate;
  const nextType = req.body.type === undefined ? event.type : String(req.body.type).toLowerCase();
  const nextSlots = req.body.totalSlots === undefined ? event.total_slots : Number(req.body.totalSlots);
  if (!isValidDate(nextDate) || new Date(nextDate) <= new Date()) {
    return res.status(400).json({ success: false, message: 'Event date must be in the future' });
  }
  if (!allowedTypes.has(nextType)) return res.status(400).json({ success: false, message: 'Invalid event type' });
  if (!Number.isInteger(nextSlots) || nextSlots < 1) return res.status(400).json({ success: false, message: 'Invalid capacity' });
  if (nextSlots < Number(event.registered_count)) return res.status(400).json({ success: false, message: 'Capacity cannot be below current registrations' });
  if (req.body.status !== undefined && !allowedStatuses.has(req.body.status)) {
    return res.status(400).json({ success: false, message: 'Invalid event status' });
  }

  const title = req.body.title === undefined ? event.title : String(req.body.title).trim();
  const club = req.body.club === undefined ? event.club : String(req.body.club).trim();
  const description = req.body.description === undefined ? event.description : String(req.body.description).trim();
  const location = req.body.location === undefined ? event.location : String(req.body.location).trim();
  const requirements = req.body.requirements === undefined ? event.requirements : normalizeRequirements(req.body.requirements);
  if (!title || !club || !description || !location) return res.status(400).json({ success: false, message: 'Required event fields cannot be empty' });

  const category = (req.body.title !== undefined || req.body.description !== undefined)
    ? await aiCategory(title, description)
    : event.category;
  const status = req.body.status === undefined ? event.status : req.body.status;

  const { rows } = await pool.query(
    `update events set title=$1, club=$2, description=$3, requirements=$4, location=$5,
            event_date=$6, type=$7, category=$8, total_slots=$9, status=$10, updated_at=now()
      where id=$11 returning *`,
    [title, club, description, requirements, location, nextDate, nextType, category, nextSlots, status, req.params.id]
  );
  res.json({ success: true, event: rows[0] });
}

app.put('/api/events/:id', requireAuth, asyncHandler(updateEvent));
app.patch('/api/events/:id', requireAuth, asyncHandler(updateEvent));

app.delete('/api/events/:id', requireAuth, asyncHandler(async (req, res) => {
  const event = await getEvent(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
  if (req.user.role !== 'admin' && String(event.created_by) !== String(req.user.id)) {
    return res.status(403).json({ success: false, message: 'You do not own this event' });
  }
  await pool.query('delete from events where id = $1', [req.params.id]);
  res.json({ success: true, message: 'Event deleted' });
}));

// Registrations / RSVP
app.post('/api/registrations', requireAuth, allowRoles('student'), asyncHandler(async (req, res) => {
  const eventId = req.body.eventId || req.body.event;
  if (!eventId) return res.status(400).json({ success: false, message: 'eventId is required' });

  const client = await pool.connect();
  try {
    await client.query('begin');
    const { rows: eventRows } = await client.query(
      `select e.*, coalesce(c.registered_count,0)::int as registered_count,
              coalesce(c.remaining_slots,e.total_slots)::int as remaining_slots
         from events e left join event_capacity c on c.id=e.id
        where e.id=$1 for update of e`,
      [eventId]
    );
    const event = eventRows[0];
    if (!event) {
      await client.query('rollback');
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.status !== 'open') {
      await client.query('rollback');
      return res.status(400).json({ success: false, message: 'Event is closed' });
    }
    if (new Date(event.event_date) <= new Date()) {
      await client.query('rollback');
      return res.status(400).json({ success: false, message: 'Cannot register for a past event' });
    }
    if (Number(event.remaining_slots) <= 0) {
      await client.query('rollback');
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    const { rows: duplicate } = await client.query(
      'select id, status from registrations where user_id=$1 and event_id=$2 for update',
      [req.user.id, eventId]
    );
    let registration;
    if (duplicate[0] && duplicate[0].status !== 'cancelled') {
      await client.query('rollback');
      return res.status(409).json({ success: false, message: 'You are already registered for this event' });
    }
    if (duplicate[0]) {
      ({ rows: [registration] } = await client.query(
        `update registrations set status='pending', updated_at=now() where id=$1 returning *`,
        [duplicate[0].id]
      ));
    } else {
      ({ rows: [registration] } = await client.query(
        `insert into registrations(user_id,event_id,status) values($1,$2,'pending') returning *`,
        [req.user.id, eventId]
      ));
    }
    await client.query('commit');
    res.status(201).json({ success: true, registration });
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}));

app.get('/api/registrations/my', requireAuth, allowRoles('student'), asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    `select r.*, e.title, e.club, e.event_date, e.location, e.category
       from registrations r join events e on e.id=r.event_id
      where r.user_id=$1 order by e.event_date desc`,
    [req.user.id]
  );
  res.json({ success: true, registrations: rows });
}));

app.get('/api/registrations/status/:eventId', requireAuth, allowRoles('student'), asyncHandler(async (req, res) => {
  const { rows } = await pool.query(
    'select * from registrations where user_id=$1 and event_id=$2',
    [req.user.id, req.params.eventId]
  );
  res.json({ success: true, registered: !!rows[0] && rows[0].status !== 'cancelled', registration: rows[0] || null });
}));

async function listEventRegistrations(req, res) {
  const event = await getEvent(req.params.id || req.params.eventId);
  if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
  if (req.user.role === 'clubLeader' && String(event.created_by) !== String(req.user.id)) {
    return res.status(403).json({ success: false, message: 'You do not own this event' });
  }
  const { rows } = await pool.query(
    `select r.id, r.status, r.created_at, r.updated_at,
            u.id as user_id, u.name, u.email, u.profile_picture
       from registrations r join users u on u.id=r.user_id
      where r.event_id=$1 order by r.created_at desc`,
    [event.id]
  );
  res.json({ success: true, registrations: rows });
}

app.get('/api/registrations/event/:id', requireAuth, allowRoles('clubLeader', 'admin'), asyncHandler(listEventRegistrations));
app.get('/api/events/:eventId/registrations', requireAuth, allowRoles('clubLeader', 'admin'), asyncHandler(listEventRegistrations));

async function updateRegistration(req, res) {
  const status = req.body.status;
  if (!allowedRegistrationStatuses.has(status)) return res.status(400).json({ success: false, message: 'Invalid registration status' });

  const { rows } = await pool.query(
    `select r.*, e.created_by from registrations r join events e on e.id=r.event_id where r.id=$1`,
    [req.params.id]
  );
  const registration = rows[0];
  if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
  if (req.user.role === 'clubLeader' && String(registration.created_by) !== String(req.user.id)) {
    return res.status(403).json({ success: false, message: 'You do not own this event' });
  }

  const { rows: updated } = await pool.query(
    'update registrations set status=$1, updated_at=now() where id=$2 returning *',
    [status, req.params.id]
  );
  res.json({ success: true, registration: updated[0] });
}

app.put('/api/registrations/:id', requireAuth, allowRoles('clubLeader', 'admin'), asyncHandler(updateRegistration));
app.patch('/api/registrations/:id/status', requireAuth, allowRoles('clubLeader', 'admin'), asyncHandler(updateRegistration));

app.delete('/api/registrations/:id', requireAuth, allowRoles('student', 'admin'), asyncHandler(async (req, res) => {
  const { rows } = await pool.query('select * from registrations where id=$1', [req.params.id]);
  const registration = rows[0];
  if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
  if (req.user.role === 'student' && String(registration.user_id) !== String(req.user.id)) {
    return res.status(403).json({ success: false, message: 'You can only cancel your own registration' });
  }
  await pool.query(`update registrations set status='cancelled', updated_at=now() where id=$1`, [req.params.id]);
  res.json({ success: true, message: 'Registration cancelled' });
}));

app.get('/api/admin/summary', requireAuth, allowRoles('admin'), asyncHandler(async (req, res) => {
  const [users, events, registrations, pendingLeaders] = await Promise.all([
    pool.query('select count(*)::int as count from users'),
    pool.query('select count(*)::int as count from events'),
    pool.query('select count(*)::int as count from registrations where status <> \'cancelled\''),
    pool.query("select count(*)::int as count from users where role='clubLeader' and status='pending'")
  ]);
  res.json({
    success: true,
    summary: {
      users: users.rows[0].count,
      events: events.rows[0].count,
      registrations: registrations.rows[0].count,
      pendingClubLeaders: pendingLeaders.rows[0].count
    }
  });
}));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (error.code === '23505') {
    return res.status(409).json({ success: false, message: 'A record with the same unique value already exists' });
  }
  if (error.code === '23503') {
    return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
  }
  return res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : 'Internal server error'
  });
});

export default app;
