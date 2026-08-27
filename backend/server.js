import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
const port=process.env.PORT||5000;
connectDB().then(()=>app.listen(port,()=>console.log(`CampusConnect API listening on ${port}`))).catch(err=>{console.error('PostgreSQL connection failed:',err.message);process.exit(1)});
