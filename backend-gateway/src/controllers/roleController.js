// roleController.js
import RolUsuario from '../model//autenticacion/RolUsuario.js';

export const getRoles = async (req, res) => {
    try {
        const roles = await RolUsuario.getRolesActivos();
        res.json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching roles' });
    }
};