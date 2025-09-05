import { DataTypes } from 'sequelize';

const AlertaStockInsumo = (sequelize) => {
    const SupplyStockAlert = sequelize.define('supply_stock_alert', {
        supply_stock_alert_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        supply_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'supply',
                key: 'supply_id'
            }
        },
        unit_of_measure_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'unit_of_measure',
                key: 'unit_of_measure_id'
            }
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
        stock_alert_status_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'stock_alert_status',
                key: 'stock_alert_status_id'
            }
        },
        supply_movement_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'supply_movement',
                key: 'supply_movement_id'
            }
        }
    }, {
        tableName: 'supply_stock_alert',
        timestamps: false,
        indexes: [
            {
                fields: ['supply_id']
            },
            {
                fields: ['stock_alert_status_id']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    SupplyStockAlert.associate = function(models) {
        // Una alerta de stock pertenece a un suministro
        SupplyStockAlert.belongsTo(models.Insumo, {
            foreignKey: 'supply_id',
            targetKey: 'supply_id',
            as: 'supply'
        });

        // Una alerta de stock pertenece a una unidad de medida
        SupplyStockAlert.belongsTo(models.UnidadMedida, {
            foreignKey: 'unit_of_measure_id',
            targetKey: 'unit_of_measure_id',
            as: 'unit_of_measure'
        });

        // Una alerta de stock pertenece a un estado de alerta
        SupplyStockAlert.belongsTo(models.Estado, {
            foreignKey: 'stock_alert_status_id',
            targetKey: 'stock_alert_status_id',
            as: 'status'
        });

        // Una alerta de stock puede estar relacionada con un movimiento de suministro
        SupplyStockAlert.belongsTo(models.MovimientoInsumo, {
            foreignKey: 'supply_movement_id',
            targetKey: 'supply_movement_id',
            as: 'supply_movement'
        });
    };

    // Metodo para encontrar alertas por suministro
    SupplyStockAlert.findBySupplyId = function(supplyId) {
        return this.findAll({
            where: { supply_id: supplyId },
            order: [['created_at', 'DESC']],
            include: [{ all: true }]
        });
    };

    // Metodo para encontrar alertas por estado
    SupplyStockAlert.findByStatus = function(statusId) {
        return this.findAll({
            where: { stock_alert_status_id: statusId },
            order: [['created_at', 'DESC']],
            include: [{ all: true }]
        });
    };

    // Metodo para encontrar alertas activas (no resueltas)
    SupplyStockAlert.findActiveAlerts = function() {
        return this.findAll({
            where: { resolved_at: null },
            order: [['created_at', 'DESC']],
            include: [{ all: true }]
        });
    };

    // Metodo para marcar una alerta como resuelta
    SupplyStockAlert.prototype.markAsResolved = function() {
        return this.update({
            resolved_at: new Date(),
            stock_alert_status_id: 'estado_resuelto_id' // Debes reemplazar con el ID correcto
        });
    };

    return SupplyStockAlert;
};

export default AlertaStockInsumo;