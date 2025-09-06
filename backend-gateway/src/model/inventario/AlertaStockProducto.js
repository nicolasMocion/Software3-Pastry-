import { DataTypes } from 'sequelize';

const AlertaStockProducto = (sequelize) => {
    const ProductStockAlert = sequelize.define('product_stock_alert', {
        product_stock_alert_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        stock_at_moment: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        critical_stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        resolved_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'product',
                key: 'product_id'
            }
        },
        stock_alert_status_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'stock_alert_status',
                key: 'stock_alert_status_id'
            }
        },
        product_movement_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'product_movement',
                key: 'product_movement_id'
            }
        }
    }, {
        tableName: 'product_stock_alert',
        timestamps: false,
        indexes: [
            {
                fields: ['product_id']
            },
            {
                fields: ['stock_alert_status_id']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    ProductStockAlert.associate = function(models) {
        // Una alerta de stock pertenece a un producto
        ProductStockAlert.belongsTo(models.Producto, {
            foreignKey: 'product_id',
            targetKey: 'product_id',
            as: 'product'
        });

        // Una alerta de stock pertenece a un estado de alerta
        ProductStockAlert.belongsTo(models.EstadoAlertaStock, {
            foreignKey: 'stock_alert_status_id',
            targetKey: 'stock_alert_status_id',
            as: 'status'
        });

        // Una alerta de stock puede estar relacionada con un movimiento de producto
        ProductStockAlert.belongsTo(models.MovimientoProducto, {
            foreignKey: 'product_movement_id',
            targetKey: 'product_movement_id',
            as: 'product_movement'
        });
    };

    // Método para encontrar alertas por producto
    ProductStockAlert.findByProductId = function(productId) {
        return this.findAll({
            where: { product_id: productId },
            order: [['created_at', 'DESC']],
            include: [{ all: true }]
        });
    };

    // Método para encontrar alertas por estado
    ProductStockAlert.findByStatus = function(statusId) {
        return this.findAll({
            where: { stock_alert_status_id: statusId },
            order: [['created_at', 'DESC']],
            include: [{ all: true }]
        });
    };

    // Método para encontrar alertas activas (no resueltas)
    ProductStockAlert.findActiveAlerts = function() {
        return this.findAll({
            where: { resolved_at: null },
            order: [['created_at', 'DESC']],
            include: [{ all: true }]
        });
    };

    // Metodo para encontrar alertas críticas (stock actual <= stock crítico)
    ProductStockAlert.findCriticalAlerts = function() {
        return this.findAll({
            where: sequelize.where(
                sequelize.col('stock_at_moment'),
                '<=',
                sequelize.col('critical_stock')
            ),
            order: [['created_at', 'DESC']],
            include: [{ all: true }]
        });
    };

    // Método para marcar una alerta como resuelta
    ProductStockAlert.prototype.markAsResolved = function() {
        return this.update({
            resolved_at: new Date(),
            stock_alert_status_id: 'est_alert_res' // Debes reemplazar con el ID correcto
        });
    };

    // Método para verificar si una alerta está activa
    ProductStockAlert.prototype.isActive = function() {
        return this.resolved_at === null;
    };

    return ProductStockAlert;
};

export default AlertaStockProducto;