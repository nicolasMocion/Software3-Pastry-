import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';
import productsRoutes from './routes/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRoutes);

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('DB connection successful:', res.rows[0]);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
