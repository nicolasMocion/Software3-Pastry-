import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import sequelize from './config/db.js';

import productsRoutes from './routes/productsRoutes.js';
//import routerUsuario from './routes/usuarioRoutes.js';
import routerAuth from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


//Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Hacer asociaciones de los modelos
import setupAssociations from './model/asociaciones.js';
setupAssociations();

// Routes
app.use('/api/products', productsRoutes);
//app.use('/api/usuario', routerUsuario);
app.use('/api/auth', routerAuth);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
    });
});

// Inicializar servidor
const startServer = async () => {
    try {
        // Probar conexión a la base de datos
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
            console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
};

// Iniciar la aplicación
startServer();