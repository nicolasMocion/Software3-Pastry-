import {DataTypes, Sequelize} from 'sequelize';
import sequelize from '../../config/db.js';

import UnidadMedida from './UnidadMedida.js';
import Insumo from './Insumo.js';
import Producto from './Producto.js'
import CategoriaProducto from "./CategoriaProducto.js";
import ImagenProducto from "./ImagenProducto.js";
import MovimientoProducto from "./MovimientoProducto.js";
import AlertaStockProducto from "./AlertaStockProducto.js";
import AlertaStockInsumo from "./AlertaStockInsumo.js";
import MovimientoInsumo from "./MovimientoInsumo.js";
import EstadoAlertaStock from "./EstadoAlertaStock.js";
import Ingrediente from "./Ingrediente.js";
import Catalogo from "./Catalogo.js";
import Menu from './Menu.js'

// Cargar modelos de inventario
const UnidadMedidaModel= UnidadMedida(sequelize, DataTypes);
const InsumoModel = Insumo(sequelize,DataTypes);
const IngredienteModel = Ingrediente(sequelize,DataTypes);
const ProductoModel = Producto(sequelize, DataTypes);
const CategoriaProductoModel = CategoriaProducto(sequelize, DataTypes);
const ImagenProductoModel = ImagenProducto(sequelize, DataTypes);
const MovimientoProductoModel = MovimientoProducto(sequelize, DataTypes);
const MovimientoInsumoModel = MovimientoInsumo(sequelize, DataTypes);
const EstadoAlertaStockModel = EstadoAlertaStock(sequelize, DataTypes);
const AlertaStockProductoModel = AlertaStockProducto(sequelize, DataTypes);
const AlertaStockInsumoModel= AlertaStockInsumo(sequelize, DataTypes);
const CatalogoModel = Catalogo(sequelize, DataTypes);
const MenuModel = Menu(sequelize, DataTypes);

// ... otros modelos de inventario

// Configurar asociaciones INTERNAS del inventario
CategoriaProductoModel.associate({ CategoriaProducto : CategoriaProductoModel, Producto : ProductoModel });
UnidadMedidaModel.associate({ Insumo: InsumoModel, MovimientoInsumo:MovimientoInsumoModel, Ingrediente: IngredienteModel });
InsumoModel.associate({UnidadMedida : UnidadMedidaModel, MovimientoInsumo: MovimientoInsumoModel, AlertaStockInsumo:AlertaStockInsumoModel, Ingrediente:IngredienteModel});
IngredienteModel.associate({ Producto:ProductoModel, Insumo:InsumoModel, UnidadMedida:UnidadMedidaModel});
ProductoModel.associate({ Producto : ProductoModel, CategoriaProducto : CategoriaProductoModel });
ImagenProductoModel.associate({Producto : ProductoModel})
MovimientoProductoModel.associate({ Producto : ProductoModel, AlertaStockProducto : AlertaStockProductoModel });
MovimientoInsumoModel.associate({Insumo : InsumoModel, UnidadMedida : UnidadMedidaModel, AlertaStockInsumo: AlertaStockInsumoModel});
EstadoAlertaStockModel.associate({AlertaStockInsumo : AlertaStockProductoModel, AlertaStockProducto : AlertaStockProductoModel});
AlertaStockProductoModel.associate({ Producto:ProductoModel, EstadoAlertaStock:EstadoAlertaStockModel, MovimientoProducto:MovimientoProductoModel});
AlertaStockInsumoModel.associate({Insumo:InsumoModel, UnidadMedida:UnidadMedidaModel, EstadoAlertaStock:EstadoAlertaStockModel, MovimientoInsumo:MovimientoInsumoModel});
CatalogoModel.associate({Menu:MenuModel, Producto:ProductoModel});
MenuModel.associate({Catalogo:CatalogoModel});
// ... otras asociaciones internas

export {
    UnidadMedidaModel as UnidadMedida,
    InsumoModel as Insumo,
    IngredienteModel as Ingrediente,
    ProductoModel as Producto,
    CategoriaProductoModel as CategoriaProducto,
    ImagenProductoModel as ImagenProducto,
    MovimientoProductoModel as MovimientoProducto,
    MovimientoInsumoModel as MovimientoInsumo,
    EstadoAlertaStockModel as EstadoAlertaStock,
    AlertaStockInsumoModel as AlertaStockInsumo,
    AlertaStockProductoModel as AlertaStockProducto,
    CatalogoModel as Catalogo,
    MenuModel as Menu,
};