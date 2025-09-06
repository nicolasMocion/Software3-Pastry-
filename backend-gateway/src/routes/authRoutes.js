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

routerAuth.get('/login', passport.authenticate('auth0', {
  scope: 'openid profile email'
}));

routerAuth.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  async (req, res, next) => {
    try {
      // Ensure we have the full user from the DB
      let user = req.user;
      if (!user || !user.user_id) {
        user = await Usuario.findOne({ where: { auth0_id: req.user?.auth0_id } });
      }

      // Business rule: on registration OR if profile incomplete → force complete-profile
      const isIncomplete = !user?.phone || !user?.cc || !user?.user_role_id || user?.needs_profile === true;

      if (isIncomplete) {
        const uid = user?.auth0_id || req.user?.auth0_id;
        return res.redirect(`http://localhost:4200/completeProfile?uid=${encodeURIComponent(uid || '')}`);
      }

      // Otherwise, enter the app
      return res.redirect('http://localhost:4200/menu');
    } catch (err) {
      return next(err);
    }
  }
);

routerAuth.post('/registerAuth', authController.registerAuth0)

routerAuth.post('/register', verifyToken, authController.register);





export default routerAuth;