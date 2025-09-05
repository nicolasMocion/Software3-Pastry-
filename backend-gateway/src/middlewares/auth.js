import { Op } from 'sequelize';
import {Usuario} from '../model/autenticacion/index.js';
    // Verificar autenticación
    export const requireAuth = async function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ error: 'Se requiere autenticación' });
    }

    // Verificar rol de administrador
    export const requireAdmin = async function (req, res, next) {
        if (req.isAuthenticated() && req.user.user_rol_id === 'rol_admin') {
            return next();
        }
        res.status(403).json({ error: 'Se requieren permisos de administrador' });
    }

    // Verificar múltiples roles segun el id de los roles
    // prestablecidos en la base de datos
    export const requireRoles = (roles) => {
        return (req, res, next) => {
        // Verificar si el usuario está autenticado
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        // Verificar si el usuario tiene al menos uno de los roles requeridos
        if (!roles.includes(req.user.user_rol_id)) {
            return res.status(403).json({ error: 'Permisos insuficientes' });
        }
        // Si todo está bien, continuar
        next();
    };
};

    // Middleware para cargar usuario completo en req
    export const loadUser = async function (req, res, next) {
        if (req.isAuthenticated() && req.user) {
            try {
                const user = await Usuario.findByPk(req.user.user_id);
                req.currentUser = user;
            } catch (error) {
                console.error('Error al cargar usuario:', error);
            }
        }
        next();
    }