import {DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

//importaciones
import Estado from './Estado.js';
import TipoMovimiento from "./TipoMovimiento.js";

//carga de modelo
const EstadoModel = Estado(sequelize, DataTypes);
const TipoMovimientoModel = TipoMovimiento(sequelize, DataTypes);

// Configurar asociaciones internas si las hay
EstadoModel.associate({ });
TipoMovimientoModel.associate({})

export {
    EstadoModel as Estado,
    TipoMovimientoModel as TipoMovimiento,
};