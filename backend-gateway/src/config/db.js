import { Pool } from 'pg';
import fs from 'fs';
import 'dotenv/config';

// Lee el certificado CA (ajusta la ruta según tu entorno)
const caCert = fs.readFileSync('./ca.pem').toString();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: true, // ✅ Importante para producción
        ca: caCert, // Usa el certificado CA
    },
});

// Manejar eventos de error en el pool
pool.on('error', (err, client) => {
    console.error('Error inesperado en el cliente de la base de datos', err);
    process.exit(-1);
});

// Exportar el pool para su uso en otras partes de la aplicación
export {
    pool
};