import {DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

//importaciones
import Estado from './Estado.js';

//carga de modelo
const EstadoModel = Estado(sequelize, DataTypes);

// Configurar asociaciones internas si las hay
EstadoModel.associate({ Estado : EstadoModel });

export {
    EstadoModel as Estado,
};