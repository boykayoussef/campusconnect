import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, connectDB } from './config/db.js';
await connectDB();
const users=[
 {name:'System Admin',email:'admin@campusconnect.local',password:'Admin123!',role:'admin',status:'approved'},
 {name:'Campus Club Leader',email:'leader@campusconnect.local',password:'Leader123!',role:'clubLeader',status:'approved'},
 {name:'Campus Student',email:'student@campusconnect.local',password:'Student123!',role:'student',status:'approved'}
];
const ids={};
for(const u of users){const hash=await bcrypt.hash(u.password,12);const r=await pool.query(`insert into users(name,email,password_hash,role,status) values($1,$2,$3,$4,$5) on conflict(email) do update set name=excluded.name,password_hash=excluded.password_hash,role=excluded.role,status=excluded.status returning id`,[u.name,u.email,hash,u.role,u.status]);ids[u.role]=r.rows[0].id}
const events=[
 ['AI Study Jam','AI & Technology Club','A collaborative study session covering practical AI concepts, study strategies, and responsible use of generative AI.',['Bring a laptop','Basic programming knowledge recommended'],'Innovation Lab','2026-09-12T14:00:00Z','workshop','Technology',40],
 ['GIU Hackathon 2026','Computer Science Club','A campus coding competition where teams build creative software solutions to a student-life challenge.',['Teams of 2-4 students','Laptop required'],'Main Auditorium','2026-09-19T09:00:00Z','competition','Technology',80],
 ['Campus Sports Day','Sports Club','A social day of friendly football, basketball, table tennis, and team activities.',['Sportswear recommended'],'University Sports Complex','2026-09-26T10:00:00Z','social','Sports',100],
 ['Career & Internship Fair','Career Development Club','Meet employers, discover internships, and attend short career sessions designed for university students.',['Bring a CV if available'],'Student Center','2026-10-03T11:00:00Z','workshop','Career',120],
 ['Community Volunteering Day','Community Service Club','A campus volunteering day focused on community support and practical service activities.',['Register before the event','Wear comfortable clothing'],'Community Outreach Center','2026-10-10T09:00:00Z','volunteering','Volunteering',50],
 ['Startup Ideas Workshop','Entrepreneurship Club','Turn a student idea into a simple startup concept through problem discovery, validation, and pitching exercises.',['Bring one idea to discuss'],'Business School Room B204','2026-10-17T13:00:00Z','workshop','Career',35],
 ['Art & Design Exhibition','Arts Club','A student exhibition showcasing illustration, photography, graphic design, and creative projects.',[],'Arts Building Gallery','2026-10-24T16:00:00Z','social','Arts',70],
 ['Photography Walk Around Campus','Photography Club','A relaxed photography walk exploring campus architecture, student life, and creative composition.',['Phone or camera'],'Main Gate','2026-10-31T15:00:00Z','social','Arts',30]
];
for(const e of events){await pool.query(`insert into events(title,club,description,requirements,location,event_date,type,category,total_slots,status,created_by) values($1,$2,$3,$4,$5,$6,$7,$8,$9,'open',$10) on conflict do nothing`,[...e,ids.clubLeader])}
console.log(`Demo data ready: ${events.length} events`);await pool.end();
