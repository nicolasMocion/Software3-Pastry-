import { DataTypes } from 'sequelize';

const MovimientoInsumo = (sequelize) => {
    const SupplyMovement = sequelize.define('supply_movement', {
        supply_movement_id: {
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
        movement_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'movement_type',
                key: 'movement_type_id'
            }
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        measure_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        unit_of_measure_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'unit_of_measure',
                key: 'unit_of_measure_id'
            }
        }
    }, {
        tableName: 'supply_movement',
        timestamps: false,
        indexes: [
            {
                fields: ['supply_id']
            },
            {
                fields: ['movement_type_id']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    SupplyMovement.associate = function(models) {
        // Un movimiento de suministro pertenece a un suministro
        SupplyMovement.belongsTo(models.Insumo, {
            foreignKey: 'supply_id',
            targetKey: 'supply_id',
            as: 'supply'
        });

        // Un movimiento de suministro pertenece a un tipo de movimiento
        SupplyMovement.belongsTo(models.TipoMovimiento, {
            foreignKey: 'movement_type_id',
            targetKey: 'movement_type_id',
            as: 'movement_type'
        });

        // Un movimiento de suministro pertenece a un usuario
        SupplyMovement.belongsTo(models.Usuario, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            as: 'user'
        });

        // Un movimiento de suministro puede tener una unidad de medida
        SupplyMovement.belongsTo(models.UnidadMedida, {
            foreignKey: 'unit_of_measure_id',
            targetKey: 'unit_of_measure_id',
            as: 'unit_of_measure'
        });

        // Un movimiento de suministro puede estar relacionado con una alerta de stock
        SupplyMovement.hasOne(models.AlertaStockInsumo, {
            foreignKey: 'supply_movement_id',
            sourceKey: 'supply_movement_id',
            as: 'stock_alert'
        });
    };

    // Método para encontrar movimientos por suministro
    SupplyMovement.findBySupplyId = function(supplyId) {
        return this.findAll({
            where: { supply_id: supplyId },
            include: [{ all: true }],
            order: [['created_at', 'DESC']]
        });
    };

    // Método para encontrar movimientos por tipo
    SupplyMovement.findByMovementType = function(movementTypeId) {
        return this.findAll({
            where: { movement_type_id: movementTypeId },
            include: [{ all: true }],
            order: [['created_at', 'DESC']]
        });
    };

    // Método para encontrar movimientos por usuario
    SupplyMovement.findByUserId = function(userId) {
        return this.findAll({
            where: { user_id: userId },
            include: [{ all: true }],
            order: [['created_at', 'DESC']]
        });
    };

    // Método para encontrar movimientos en un rango de fechas
    SupplyMovement.findByDateRange = function(startDate, endDate) {
        return this.findAll({
            where: {
                created_at: {
                    [sequelize.Op.between]: [startDate, endDate]
                }
            },
            include: [{ all: true }],
            order: [['created_at', 'DESC']]
        });
    };

    // Método para aplicar el movimiento al stock del suministro
    SupplyMovement.prototype.applyToStock = async function() {
        const movementType = await sequelize.models.MovementType.findByPk(this.movement_type_id);

        if (movementType && movementType.affects_stock) {
            const supply = await sequelize.models.Supply.findByPk(this.supply_id);
            if (supply) {
                const stockChange = movementType.movement_sign * this.measure_quantity;
                await supply.updateStock(stockChange);
            }
        }
    };

    return SupplyMovement;
};

export default MovimientoInsumo;