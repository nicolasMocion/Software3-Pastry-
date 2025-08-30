import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,        // e.g., 'pastry_user'
  host: process.env.DB_HOST,        // e.g., 'localhost'
  database: process.env.DB_NAME,    // e.g., 'pastry_db'
  password: process.env.DB_PASSWORD,// e.g., 'yourpassword'
  port: process.env.DB_PORT || 5432
});

pool.on('connect', () => {
  console.log('Connected to the database!');
});
