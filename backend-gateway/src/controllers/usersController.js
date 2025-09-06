import {Usuario, RolUsuario} from "../model/autenticacion/index.js";
import {Op} from "sequelize";
import {Estado} from "../model/catalogo/index.js";

export const getUsers = async function (req, res) {
    try {
        const { page = 1, limit = 10, role, status, search } = req.query;
        const offset = (page - 1) * limit;

        // Construir condiciones de filtrado
        const whereConditions = {};
        const includeConditions = [];

        if (role) {
            includeConditions.push({
                model: RolUsuario,
                as: 'role',
                where: { user_role_id: role }
            });
        }

        if (status) {
            whereConditions.status_id = status;
        }

        if (search) {
            whereConditions[Op.or] = [
                { full_name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const users = await Usuario.findAndCountAll({
            where: whereConditions,
            include: [
                ...includeConditions,
                {
                    model: RolUsuario,
                    as: 'role',
                    attributes: ['user_role_id', 'role_name']
                },
                {
                    model: Estado,
                    as: 'status',
                    attributes: ['status_id', 'name']
                }
            ],
            attributes: { exclude: ['auth0_id'] }, // Excluir información sensible
            limit: parseInt(limit),
            offset: offset,
            order: [['created_at', 'DESC']]
        });

        res.json({
            users: users.rows,
            totalPages: Math.ceil(users.count / limit),
            currentPage: parseInt(page),
            totalUsers: users.count
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
    }
}

export const getUserById = async function (req, res){
    try {
        const { id } = req.params;

        const user = await Usuario.findByPk(id, {
            include: [
                {
                    model: RolUsuario,
                    as: 'role',
                    attributes: ['user_role_id', 'role_name', 'description']
                },
                {
                    model: Estado,
                    as: 'status',
                    attributes: ['status_id', 'name', 'description']
                }
            ],
            attributes: { exclude: ['auth0_id'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario', details: error.message });
    }
}

export const createUser = async  function (req, res){
    try {
        const { full_name, email, phone, user_role_id, status_id, cc } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'El usuario ya existe' });
        }

        // Crear el usuario en la base de datos
        const newUser = await User.create({
            full_name,
            email,
            phone,
            user_role_id: user_role_id || 'rol_cliente', // Valor por defecto
            status_id: status_id || 'est_user_act', // Valor por defecto
            cc
            // auth0_id se establecerá después de crear el usuario en Auth0
        });

        // Aquí podrías integrar con Auth0 Management API para crear el usuario en Auth0
        // y luego actualizar el auth0_id en tu base de datos
        //
        //LLENAR/COMPLETAR
        //
        //

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                user_id: newUser.user_id,
                full_name: newUser.full_name,
                email: newUser.email,
                phone: newUser.phone,
                user_role_id: newUser.user_role_id,
                status_id: newUser.status_id
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario', details: error.message });
    }
}

// Actualizar información de usuario
export const updateUser = async function (req, res) {
    try {
        const { id } = req.params;
        const { full_name, phone, user_role_id, status_id, cc } = req.body;

        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Administradores pueden actualizar todos los campos
        await user.update({ full_name, phone, user_role_id, status_id, cc });


        res.json({ message: 'Usuario actualizado exitosamente', user });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
    }
},

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