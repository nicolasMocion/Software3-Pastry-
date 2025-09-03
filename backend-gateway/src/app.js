import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import { loadUser } from './middlewares/auth.js';

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
app.use(session({
    secret: process.env.SECRET_JWT,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
    }
))
app.use(passport.initialize());
app.use(passport.session());
app.use(loadUser); // Cargar usuario completo en req.currentUser



//Hacer asociaciones de los modelos
import setupAssociations from './model/asociaciones.js';
setupAssociations();


// Routes
app.get('/', (req, res) => {
    res.json({ message: 'API de Pastelería con Auth0 y Sequelize' });
});
app.use('/api/products', productsRoutes);
app.use('/', routerAuth);

// Ruta de callback
app.get('/callback',
    passport.authenticate('auth0', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);
// Ruta de logout
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('https://' + process.env.AUTH0_DOMAIN + '/v2/logout?returnTo=' + process.env.LOGOUT_REDIRECT);
});

// Sincronizar base de datos y iniciar servidor
import syncDatabase from './scripts/syncDatabase.js';

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
        await syncDatabase();
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