import {Usuario, RolUsuario} from "../model/autenticacion/index.js";
import {Estado} from "../model/catalogo/index.js";
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const registerAuth0 = async function (req, res){
    const { email, password, nombre_completo, telefono, cedula, rol } = req.body;

    try {
        // 1. Registrar en Auth0 (solo autenticacion)
        console.log('registro en Auth0');
        const auth0Response = await axios.post(
            `https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
            {
                client_id: process.env.AUTH0_CLIENT_ID,
                email: email,
                password: password,
                connection: 'Username-Password-Authentication'
            }
        );

        // 2. Guardar en nuestra base de datos con Sequelize
        console.log('registro en DB');
        const user = await Usuario.create({
            auth0_id: auth0Response.data._id,
            email : email,
            full_name : nombre_completo || email,
            number : telefono || "",
            cc : cedula || "",
            user_role_id: rol || 'rol_cliente'
        });

        // 3. Responder sin información sensible
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                number: user.number,
                cc: user.cc,
                user_role_id: user.user_role_id,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Error en registro:', error.response?.data || error.message);

        if (error.response?.data?.error === 'user_exists') {
            return res.status(409).json({
                error: 'Ya existe un usuario con este email'
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor durante el registro'
        });
    }
}

export const getProfileAuth0 = async function (req, res) {
    try {
        const user = await Usuario.findByPk(req.user.user_id, {
            attributes: { exclude: ['auth0_id'] }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
}

export const updateProfileAuth0 = async function (req, res) {
    try {
        const { nombre_completo, telefono } = req.body;

        const user = await Usuario.findByPk(req.user.user_id);
        await user.update({
            full_name: nombre_completo || user.full_name,
            number: telefono || user.number
        });

        res.json({
            message: 'Perfil actualizado correctamente',
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
                number: user.number,
                cc: user.cc,
                user_role_id: user.user_role_id
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
};



export const login = async (req, res) => {
    try {
        // Validar campos requeridos
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ error: 'Email and password are required' });
        }

        // Buscar usuario
        const userFound = await Usuario.findOne({
            where: { email: req.body.email,
            status_id : await Estado.getIdEstadoByEntityAndName("user","Active")},
        });

        if (!userFound) {
            return res.status(401).json({
                error: 'Invalid email'
            });
        }
        console.log(typeof userFound.validarContrasenia+"-----------------------"); // debería ser 'function'

        // Verificar contraseña
        const matchPassword = await userFound.validarContrasenia(req.body.password);

        console.log(typeof matchPassword+"---------------------------------"); // debería ser 'boolean'

        if (!matchPassword) {
            return res.status(401).json({
                token: null,
                message: 'Incorrect password'
            });
        }

        // Si la contraseña es correcta, generar token JWT
        const token = jwt.sign(
            {userId: userFound.user_id},
            process.env.SECRET_JWT,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token: token,
            user: {
                user_id: userFound.user_id,
                email: userFound.email,
                full_name: userFound.full_name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }

};



export const register = async (req, res) => {
    try {
        let { email, password, full_name, phone_number} = req.body;

        // Colocar el rol de cliente
        const role_id = await RolUsuario.getRolIdByName("Client");

        // Obtener el estado activo
        const statusId = await Estado.getIdEstadoByEntityAndName("user", "Active");

        const [newUser, creado] = await Usuario.findOrCreate({
            where: { email: email },
            defaults: {
                full_name: full_name,
                email: email,
                encrypted_password: password,
                phone: phone_number,
                status_id: statusId,
                user_role_id: role_id
            }
        });

        if (creado) {
            const token = jwt.sign({id:newUser.id}, process.env.SECRET_JWT, {expiresIn: "1h"});

            console.log("Usuario creado exitosamente");

            res.status(201).json({
                message: "Usuario registrado exitosamente",
                userResponse: {
                    //solo campos que se quieren exponer
                    user_id: newUser.user_id,
                    full_name: newUser.full_name,
                    email: newUser.email,
                    phone: newUser.phone,
                    created_at: newUser.created_at,
                    status_id: newUser.status_id,
                    user_rol_id: newUser.user_rol_id
                },
                token: token // Incluye el token JWT
            });
        } else {
            console.log("El email ya se encuentra registrado en la base de datos");
            res.status(409).json({
                error: "El email ya está registrado"
            });
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message
        });
    }

};

export default {
    register,
    login
};

