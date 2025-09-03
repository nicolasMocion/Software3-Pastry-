import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

import Producto from './Producto.js'
import CategoriaProducto from "./CategoriaProducto.js";


// Cargar modelos de inventario
const ProductoModel = Producto(sequelize, DataTypes);
const CategoriaProductoModel = CategoriaProducto(sequelize, DataTypes);
//const Insumo = require('./Insumo')(sequelize, DataTypes);
//const MovimientoProducto = require('./MovimientoProducto')(sequelize, DataTypes);
//const MovimientoInsumo = require('./MovimientoInsumo')(sequelize, DataTypes);

// ... otros modelos de inventario

// Configurar asociaciones INTERNAS del inventario
ProductoModel.associate({ Producto : ProductoModel, CategoriaProducto : CategoriaProductoModel });
CategoriaProductoModel.associate({ CategoriaProducto : CategoriaProductoModel, Producto : ProductoModel });
// ... otras asociaciones internas

export {
    ProductoModel as Producto,
    CategoriaProductoModel as CategoriaProducto,
};