import {Usuario, RolUsuario} from "../model/autenticacion/index.js";
import {Estado} from "../model/catalogo/index.js";
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const registerAuth0 = async function (req, res){
    const { email, password, full_name, number, cc, user_rol_id } = req.body;

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
            full_name : full_name || email,
            number : number || "",
            cc : cc || "",
            user_role_id: user_rol_id || 'rol_cliente'
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

