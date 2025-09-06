import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import { loadUser } from './middlewares/auth.js';
import auth0Webhook from './routes/auth0Webhook.js';
import { Usuario } from './model/autenticacion/index.js';

import productsRoutes from './routes/productsRoutes.js';
import routerAuth from "./routes/authRoutes.js";
import routerRole from "./routes/rolesRoutes.js";
import profileComplete from './routes/profileComplete.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;


//Middlewares

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET_JWT,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(loadUser); // Cargar usuario completo en req.currentUser


//Hacer asociaciones de los modelos
import setupAssociations from './model/asociaciones.js';
setupAssociations();


// Routes
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => {
    res.json({ message: 'API de Pastelería con Auth0 y Sequelize' });
});
app.use('/api', profileComplete);
app.use('/api/products', productsRoutes);
app.use('/auth', routerAuth);
app.use('/', routerRole)
app.use('/api', auth0Webhook);
// Ruta de callback
app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  async (req, res, next) => {
    try {
      // Try to get full user from DB by auth0_id
      const auth0Id = req.user?.auth0_id || (req.user?.id ? req.user.id : null);
      let user = null;
      if (auth0Id) {
        user = await Usuario.findOne({ where: { auth0_id: auth0Id } });
      }

      // If we couldn't fetch, fall back to currentUser loaded by middleware (if present)
      if (!user && req.currentUser) user = req.currentUser;

      // Business rule: new users or users missing any of these fields must complete profile
      const isIncomplete = !user?.phone || !user?.cc || !user?.user_role_id || user?.needs_profile === true;

      if (isIncomplete) {
        const uid = (user && user.auth0_id) || auth0Id || '';
        return res.redirect(`http://localhost:4200/complete-profile?uid=${encodeURIComponent(uid)}`);
      }

      // Otherwise, send to app root
      return res.redirect('http://localhost:4200/menu');
    } catch (err) {
      return next(err);
    }
  }
);
// Ruta de logout
app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err); }
        res.redirect('http://localhost:4200/about');
    });
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