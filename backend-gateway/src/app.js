import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Pastry API Gateway is running!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });


pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('DB connection error', err);
    } else {
      console.log('DB connection successful:', res.rows[0]);
    }
  });
  