import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

//importaciones
import Usuario from './Usuario.js'
import RolUsuario from './RolUsuario.js'
import TokenRestablecimiento from './TokenRestablecimiento.js'

// Cargar modelos de autenticación
const UsuarioModel = Usuario(sequelize,DataTypes);
const RolUsuarioModel = RolUsuario(sequelize, DataTypes);
const TokenRestablecimientoModel = TokenRestablecimiento(sequelize, DataTypes);

// Configurar asociaciones internas (solo entre modelos de autenticación)
UsuarioModel.associate({ Usuario : UsuarioModel, RolUsuario : RolUsuarioModel, TokenRestablecimiento : TokenRestablecimientoModel });
RolUsuarioModel.associate({ Usuario : UsuarioModel, RolUsuario : RolUsuarioModel });
TokenRestablecimientoModel.associate({ Usuario : UsuarioModel, TokenRestablecimiento : TokenRestablecimientoModel });

export {
    UsuarioModel as Usuario,
    RolUsuarioModel as RolUsuario,
    TokenRestablecimientoModel as TokenRestablecimiento,
};