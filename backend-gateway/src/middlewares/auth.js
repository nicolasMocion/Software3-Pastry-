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

    // Verificar múltiples roles
    export const requireRoles = async function (roles){
        return (req, res, next) => {
            if (req.isAuthenticated() && roles.includes(req.user.user_role_id)) {
                return next();
            }
            res.status(403).json({ error: 'Permisos insuficientes' });
        };
    }

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