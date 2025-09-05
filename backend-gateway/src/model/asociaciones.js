import { Usuario } from '../model/autenticacion/index.js';
import {Estado, TipoMovimiento} from '../model/catalogo/index.js';
import { Producto, CategoriaProducto, MovimientoProducto, MovimientoInsumo } from '../model/inventario/index.js';
//const { Pedido, DetallePedido, Pago, Venta } = require('./pedidos');
//const { SeguimientoPedido, ComprobantePedido, IncidentePedido, Ubicacion } = require('./seguimiento');
//const { EstadoAlertaStock, MedioPago, TipoIncidente } = require('./catalogo');

function setupAssociations() {
    console.log('Configurando asociaciones entre procesos...');

    // ==================== ASOCIACIONES CON ESTADO ====================
    Usuario.belongsTo(Estado, { foreignKey: 'status_id', targetKey: 'status_id', as: 'estado' });
    Estado.hasMany(Usuario, { foreignKey: 'status_id', sourceKey: 'status_id', as: 'usuarios' });

    Producto.belongsTo(Estado, { foreignKey: 'status_id', targetKey: 'status_id', as: 'estado' });
    Estado.hasMany(Producto, { foreignKey: 'status_id', sourceKey: 'status_id', as: 'productos' });
/*
    Pedido.belongsTo(Estado, { foreignKey: 'status_id', targetKey: 'status_id', as: 'estado' });
    Estado.hasMany(Pedido, { foreignKey: 'status_id', sourceKey: 'status_id', as: 'pedidos' });
*/

    // ... otras asociaciones con Estado

    //==================== RELACION TIPO MOVIMIENTO CON MOVIMIENTOS==========================

    TipoMovimiento.hasMany(MovimientoProducto, { foreignKey: 'movement_type_id', sourceKey: 'movement_type_id', as: 'producto' });
    MovimientoProducto.belongsTo(TipoMovimiento, {
        foreignKey: 'movement_type_id',
        targetKey: 'movement_type_id',
        as: 'movement_type'
    });

    // ==================== ASOCIACIONES DE MOVIMIENTOS CON USUARIO ====================

    // MovimientoProducto → Usuario (quien realizó el movimiento)
    MovimientoProducto.belongsTo(Usuario, {
        foreignKey: 'user_id',
        targetKey: 'user_id',
        as: 'usuario'
    });
    Usuario.hasMany(MovimientoProducto, {
        foreignKey: 'user_id',
        sourceKey: 'user_id',
        as: 'movimientosProducto'
    });

    // MovimientoInsumo → Usuario (quien realizó el movimiento)
    MovimientoInsumo.belongsTo(Usuario, {
        foreignKey: 'user_id',
        targetKey: 'user_id',
        as: 'usuario'
    });

    Usuario.hasMany(MovimientoInsumo, {
        foreignKey: 'user_id',
        sourceKey: 'user_id',
        as: 'movimientosInsumo'
    });


    // ==================== ASOCIACIONES DE INVENTARIO CON OTROS PROCESOS ====================
    /*
    DetallePedido.belongsTo(Producto, { foreignKey: 'product_id', targetKey: 'product_id', as: 'producto' });
    Producto.hasMany(DetallePedido, { foreignKey: 'product_id', sourceKey: 'product_id', as: 'detallesPedido' });
*/


    // ==================== ASOCIACIONES DE PEDIDOS CON AUTENTICACIÓN ====================
/*
    Pedido.belongsTo(Usuario, { foreignKey: 'user_id', targetKey: 'user_id', as: 'cliente' });
    Usuario.hasMany(Pedido, { foreignKey: 'user_id', sourceKey: 'user_id', as: 'pedidosCliente' });

    Pedido.belongsTo(Usuario, { foreignKey: 'repartidor_id', targetKey: 'user_id', as: 'repartidor' });
    Usuario.hasMany(Pedido, { foreignKey: 'repartidor_id', sourceKey: 'user_id', as: 'pedidosRepartidor' });
*/


    // ==================== ASOCIACIONES DE SEGUIMIENTO ====================
/*
    SeguimientoPedido.belongsTo(Pedido, { foreignKey: 'pedido_id', targetKey: 'pedido_id', as: 'pedido' });
    Pedido.hasMany(SeguimientoPedido, { foreignKey: 'pedido_id', sourceKey: 'pedido_id', as: 'seguimientos' });

    SeguimientoPedido.belongsTo(Usuario, { foreignKey: 'user_id', targetKey: 'user_id', as: 'usuario' });
    Usuario.hasMany(SeguimientoPedido, { foreignKey: 'user_id', sourceKey: 'user_id', as: 'seguimientos' });
*/


    console.log('Asociaciones entre procesos configuradas correctamente');
}

export  default setupAssociations;