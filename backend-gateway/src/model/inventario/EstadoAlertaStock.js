import { DataTypes } from 'sequelize';

const EstadoAlertaStock = (sequelize) => {
    const StockAlertStatus = sequelize.define('stock_alerta_status', {
        stock_alert_status_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        alert_status_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        status_description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'stock_alert_status',
        timestamps: false,
        indexes: [
            {
                fields: ['alert_status_name']
            }
        ]
    });

    StockAlertStatus.associate = function(models) {
        // Un estado de alerta puede tener muchas alertas de productos
        StockAlertStatus.hasMany(models.AlertaStockProducto, {
            foreignKey: 'stock_alert_status_id',
            sourceKey: 'stock_alert_status_id',
            as: 'product_stock_alerts'
        });

        // Un estado de alerta puede tener muchas alertas de suministros
        StockAlertStatus.hasMany(models.AlertaStockInsumo, {
            foreignKey: 'stock_alert_status_id',
            sourceKey: 'stock_alert_status_id',
            as: 'supply_stock_alerts'
        });
    };

    // Método para encontrar estado por nombre
    StockAlertStatus.findByName = function(name) {
        return this.findOne({
            where: {
                alert_status_name: sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('alert_status_name')),
                    'LIKE',
                    `%${name.toLowerCase()}%`
                )
            }
        });
    };

    return StockAlertStatus;
};

export default EstadoAlertaStock;