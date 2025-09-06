import {RolUsuario} from "../model/autenticacion/index.js";

export const getAllRoles = async function (req, res) {
    return await RolUsuario.findAll();
}
