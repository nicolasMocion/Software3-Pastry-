const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Estado = sequelize.define('Estado', {
        estado_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        entidad: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        descripcion: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'estado',
        timestamps: false,
        indexes: [
            {
                fields: ['entidad']
            }
        ]
    });

    // Metodo para configurar asociaciones
    Estado.associate = function(models) {
        // Un estado puede tener muchos usuarios
        Estado.hasMany(models.Usuario, {
            foreignKey: 'estado_id',
            sourceKey: 'estado_id',
            as: 'usuarios'
        });

        // Un estado puede tener muchos pedidos
        Estado.hasMany(models.Pedido, {
            foreignKey: 'estado_id',
            sourceKey: 'estado_id',
            as: 'pedidos'
        });

        // Un estado puede tener muchos productos
        Estado.hasMany(models.Producto, {
            foreignKey: 'estado_id',
            sourceKey: 'estado_id',
            as: 'productos'
        });

        // Un estado puede tener muchos seguimientos de pedidos
        Estado.hasMany(models.SeguimientoPedido, {
            foreignKey: 'estado_id',
            sourceKey: 'estado_id',
            as: 'seguimientos'
        });

        // Un estado puede tener muchos pagos
        Estado.hasMany(models.Pago, {
            foreignKey: 'estado_id',
            sourceKey: 'estado_id',
            as: 'pagos'
        });

        // Un estado puede tener muchas ventas
        Estado.hasMany(models.Venta, {
            foreignKey: 'estado_id',
            sourceKey: 'estado_id',
            as: 'ventas'
        });

        // Un estado puede tener muchos incidentes de pedidos
        Estado.hasMany(models.IncidentePedido, {
            foreignKey: 'estado_id',
            sourceKey: 'estado_id',
            as: 'incidentes'
        });
    };

    // Metodo de clase para obtener estados por entidad
    Estado.findByEntidad = function(entidad) {
        return this.findAll({ where: { entidad } });
    };

    // Metodo de clase para obtener estado activo de usuario
    Estado.getEstadoActivoUsuario = function() {
        return this.findOne({
            where: {
                entidad: 'usuario',
                nombre: 'activo'
            }
        });
    };

    // Metodo de clase para obtener estado inactivo de usuario
    Estado.getEstadoInactivoUsuario = function() {
        return this.findOne({
            where: {
                entidad: 'usuario',
                nombre: 'inactivo'
            }
        });
    };

    return Estado;
};