import  Auth0Strategy from 'passport-auth0';
import {Usuario} from '../model/autenticacion/index.js';

const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL,
        scope: 'openid email profile',
        state: true
    },
    async (accessToken, refreshToken, extraParams, profile, done) => {
        try {
            // Buscar usuario por auth0_id
            const authId = profile.id.split('|')[1];
            let user = await Usuario.findByAuth0Id(authId);

            if (user) {
                // Usuario existe, actualizar si es necesario
                return done(null, user);
            } else {
                // Crear nuevo usuario
                user = await Usuario.create({
                    auth0_id: authId,
                    email: profile.emails[0].value,
                    full_name: profile.displayName || profile.emails[0].value,
                    number : profile.number || "",
                    cc : profile.cc || "",
                    //
                    //
                    //
                    //
                    // Los campos adicionales se pueden completar después
                });

                return done(null, user);
            }
        } catch (error) {
            return done(error, null);
        }
    }
);

export {strategy};