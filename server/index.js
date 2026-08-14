import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import jobsRoutes from './routes/jobs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/jobs', jobsRoutes);
app.get('/', (req, res) => res.send('Jobs API'));

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`.yellow.bold),
);
