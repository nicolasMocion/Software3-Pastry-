import {Usuario, RolUsuario} from "../model/autenticacion/index.js";
import {Estado} from "../model/catalogo/index.js"
import jwt from 'jsonwebtoken';


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

