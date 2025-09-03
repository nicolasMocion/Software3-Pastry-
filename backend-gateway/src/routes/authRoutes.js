import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import {verifyToken} from '../middlewares/index.js';
import passport from 'passport'
import {Usuario} from "../model/autenticacion/index.js";

const routerAuth = Router();


// Configurar Passport
import {strategy} from '../config/auth0.js';
passport.use(strategy);

// Serialización de usuario para sesiones
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Usuario.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

routerAuth.get('/login',
    passport.authenticate('auth0', {
        scope: 'openid profile email'
    })
);

routerAuth.post('/registerAuth', authController.registerAuth0)


routerAuth.post('/register', verifyToken, authController.register);

export default routerAuth;