import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Event from './models/Event.js';

await connectDB();

const passwordHash = await bcrypt.hash('Student123!', 12);
const leaderPasswordHash = await bcrypt.hash('Leader123!', 12);

const admin = await User.findOneAndUpdate(
  { email: 'admin@campusconnect.local' },
  { $setOnInsert: { name: 'System Admin', email: 'admin@campusconnect.local', password: await bcrypt.hash('Admin123!', 12), role: 'admin', status: 'approved' } },
  { upsert: true, new: true }
);
const leader = await User.findOneAndUpdate(
  { email: 'leader@campusconnect.local' },
  { $set: { name: 'Campus Club Leader', email: 'leader@campusconnect.local', password: leaderPasswordHash, role: 'clubLeader', status: 'approved' } },
  { upsert: true, new: true }
);
await User.findOneAndUpdate(
  { email: 'student@campusconnect.local' },
  { $set: { name: 'Campus Student', email: 'student@campusconnect.local', password: passwordHash, role: 'student', status: 'approved' } },
  { upsert: true, new: true }
);

const events = [
  { title: 'AI Study Jam', club: 'AI & Technology Club', description: 'A collaborative study session covering practical AI concepts, study strategies, and responsible use of generative AI.', requirements: ['Bring a laptop', 'Basic programming knowledge recommended'], location: 'Innovation Lab', eventDate: new Date('2026-09-12T14:00:00Z'), type: 'workshop', category: 'Technology', totalSlots: 40 },
  { title: 'GIU Hackathon 2026', club: 'Computer Science Club', description: 'A campus coding competition where teams build creative software solutions to a student-life challenge.', requirements: ['Teams of 2-4 students', 'Laptop required'], location: 'Main Auditorium', eventDate: new Date('2026-09-19T09:00:00Z'), type: 'competition', category: 'Technology', totalSlots: 80 },
  { title: 'Campus Sports Day', club: 'Sports Club', description: 'A social day of friendly football, basketball, table tennis, and team activities.', requirements: ['Sportswear recommended'], location: 'University Sports Complex', eventDate: new Date('2026-09-26T10:00:00Z'), type: 'social', category: 'Sports', totalSlots: 100 },
  { title: 'Career & Internship Fair', club: 'Career Development Club', description: 'Meet employers, discover internships, and attend short career sessions designed for university students.', requirements: ['Bring a CV if available'], location: 'Student Center', eventDate: new Date('2026-10-03T11:00:00Z'), type: 'workshop', category: 'Career', totalSlots: 120 },
  { title: 'Community Volunteering Day', club: 'Community Service Club', description: 'A campus volunteering day focused on community support and practical service activities.', requirements: ['Register before the event', 'Wear comfortable clothing'], location: 'Community Outreach Center', eventDate: new Date('2026-10-10T09:00:00Z'), type: 'volunteering', category: 'Volunteering', totalSlots: 50 },
  { title: 'Startup Ideas Workshop', club: 'Entrepreneurship Club', description: 'Turn a student idea into a simple startup concept through problem discovery, validation, and pitching exercises.', requirements: ['Bring one idea to discuss'], location: 'Business School Room B204', eventDate: new Date('2026-10-17T13:00:00Z'), type: 'workshop', category: 'Career', totalSlots: 35 },
  { title: 'Art & Design Exhibition', club: 'Arts Club', description: 'A student exhibition showcasing illustration, photography, graphic design, and creative projects.', requirements: [], location: 'Arts Building Gallery', eventDate: new Date('2026-10-24T16:00:00Z'), type: 'social', category: 'Arts', totalSlots: 70 },
  { title: 'Photography Walk Around Campus', club: 'Photography Club', description: 'A relaxed photography walk exploring campus architecture, student life, and creative composition.', requirements: ['Phone or camera'], location: 'Main Gate', eventDate: new Date('2026-10-31T15:00:00Z'), type: 'social', category: 'Arts', totalSlots: 30 }
];

for (const data of events) {
  await Event.updateOne({ title: data.title }, { $set: { ...data, createdBy: leader._id, status: 'open' } }, { upsert: true });
}

console.log(`Demo data ready: ${events.length} events, admin ${admin.email}, leader ${leader.email}, student student@campusconnect.local`);
await mongoose.disconnect();
