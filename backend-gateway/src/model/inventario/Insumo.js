import { DataTypes } from 'sequelize';

const Insumo = (sequelize) => {
    const Supply = sequelize.define('Supply', {
        supply_id: {
            type: DataTypes.UUID,
            //automaticamente se crea un UUID
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        supply_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
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
        measure_quantity: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        unit_cost: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        current_stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        critical_stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        expiration_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'supply',
        timestamps: false,
        indexes: [
            {
                fields: ['supply_name']
            },
            {
                fields: ['unit_of_measure_id']
            },
            {
                fields: ['expiration_date']
            }
        ]
    });

    Supply.associate = function(models) {
        // Un suministro pertenece a una unidad de medida
        Supply.belongsTo(models.UnidadMedida, {
            foreignKey: 'unit_of_measure_id',
            targetKey: 'unit_of_measure_id',
            as: 'unit_of_measure'
        });

        // Un suministro puede tener muchos movimientos
        Supply.hasMany(models.MovimientoInsumo, {
            foreignKey: 'supply_id',
            sourceKey: 'supply_id',
            as: 'movements'
        });

        // Un suministro puede tener muchas alertas de stock
        Supply.hasMany(models.AlertaStockInsumo, {
            foreignKey: 'supply_id',
            sourceKey: 'supply_id',
            as: 'stock_alerts'
        });

        // Un suministro puede ser usado en muchos ingredientes
        Supply.hasMany(models.Ingrediente, {
            foreignKey: 'supply_id',
            sourceKey: 'supply_id',
            as: 'ingredients'
        });
    };

    // Método para buscar suministros por nombre
    Supply.findByName = function(name) {
        return this.findAll({
            where: {
                supply_name: sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('supply_name')),
                    'LIKE',
                    `%${name.toLowerCase()}%`
                )
            },
            include: [{ all: true }]
        });
    };

    // Método para buscar suministros con stock crítico
    Supply.findCriticalStock = function() {
        return this.findAll({
            where: sequelize.where(
                sequelize.col('current_stock'),
                '<=',
                sequelize.col('critical_stock')
            ),
            include: [{ all: true }]
        });
    };

    // Método para buscar suministros próximos a expirar
    Supply.findExpiringSoon = function(days = 7) {
        const expirationThreshold = new Date();
        expirationThreshold.setDate(expirationThreshold.getDate() + days);

        return this.findAll({
            where: {
                expiration_date: {
                    [sequelize.Op.lte]: expirationThreshold,
                    [sequelize.Op.gt]: new Date()
                }
            },
            include: [{ all: true }]
        });
    };

    // Método para actualizar el stock
    Supply.prototype.updateStock = function(quantity) {
        const newStock = this.current_stock + quantity;
        if (newStock < 0) {
            throw new Error('Stock no puede ser negativo');
        }

        return this.update({ current_stock: newStock });
    };

    // Método para verificar si el stock es crítico
    Supply.prototype.isStockCritical = function() {
        return this.current_stock <= this.critical_stock;
    };

    // Método para calcular el valor total del inventario
    Supply.prototype.getInventoryValue = function() {
        return this.current_stock * this.unit_cost;
    };

    return Supply;
};

export default Insumo;