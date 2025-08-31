import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from "./config/db.js";
import productsRoutes from './routes/productsRoutes.js';
import routerUsuario from './routes/usuarioRoutes.js';
import routerAuth from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/usuario', routerUsuario);
app.use('/api/auth', routerUsuario);

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('DB connection successful:', res.rows[0]);
  }
});

// Ruta de ejemplo que utiliza la base de datos
app.get('/', async (req, res) => {
    try {
        // Ejecutar una consulta simple para verificar la conexión
        const result = await pool.query('SELECT VERSION()');
        res.json({
            message: 'Conexión exitosa a la base de datos',
            version: result.rows[0].version,
        });
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Manejo de errores global (opcional pero recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Verificar la conexión a la base de datos al iniciar
async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Conexión a PostgreSQL establecida correctamente');
        client.release(); // Liberar el cliente al pool
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:', error.message);
        process.exit(1); // Salir si no hay conexión
    }
}

testConnection();