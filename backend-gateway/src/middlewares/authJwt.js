import jwt from 'jsonwebtoken';
import {Usuario, RolUsuario} from '../model/autenticacion/index.js'
import routerAuth from "../routes/authRoutes.js";

const requireAuth = async function (req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'No autenticado' });
}

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-auth-token'];

        if (!token) {
            return res.status(401).send('No token provided');
        }
        console.log(token);

        // Verificación asíncrona del token (mejor para rendimiento)
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        req.user_id=decoded.user_id;

        const user = await Usuario.findByPk(req.user_id);
        if (!user) {
            return res.status(404).send('No user found');
        }


        next();
    }catch (error) {
        return res.status(500).send("Unauthorized error");
    }
}

const isAdmin = async function (req, res, next) {
    const user = await Usuario.findByPk(req.user_id);
    if(user.user_role_id === 'rol_admin') {
        next();
        return;
    }
    return res.status(403).send('Requeried admin role');
}



export {
    verifyToken,
};