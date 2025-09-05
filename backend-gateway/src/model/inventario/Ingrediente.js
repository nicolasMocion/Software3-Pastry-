import { DataTypes } from 'sequelize';

const Ingrediente = (sequelize) => {
    const Ingredient = sequelize.define('Ingredient', {
        ingredient_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'product',
                key: 'product_id'
            }
        },
        supply_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'supply',
                key: 'supply_id'
            }
        },
        measure_quantity: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        unit_of_measure_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'unit_of_measure',
                key: 'unit_of_measure_id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'ingredient',
        timestamps: false,
        indexes: [
            {
                fields: ['product_id']
            },
            {
                fields: ['supply_id']
            },
            {
                fields: ['unit_of_measure_id']
            }
        ]
    });

    Ingredient.associate = function(models) {
        // Un ingrediente pertenece a un producto
        Ingredient.belongsTo(models.Producto, {
            foreignKey: 'product_id',
            targetKey: 'product_id',
            as: 'product'
        });

        // Un ingrediente pertenece a un suministro
        Ingredient.belongsTo(models.Insumo, {
            foreignKey: 'supply_id',
            targetKey: 'supply_id',
            as: 'supply'
        });

        // Un ingrediente puede tener una unidad de medida
        Ingredient.belongsTo(models.UnidadMedida, {
            foreignKey: 'unit_of_measure_id',
            targetKey: 'unit_of_measure_id',
            as: 'unit_of_measure'
        });
    };

    // Método para encontrar ingredientes por producto
    Ingredient.findByProductId = function(productId) {
        return this.findAll({
            where: { product_id: productId },
            include: [
                { model: sequelize.models.Supply, as: 'supply' },
                { model: sequelize.models.UnitOfMeasure, as: 'unit_of_measure' }
            ],
            order: [['created_at', 'ASC']]
        });
    };

    // Método para encontrar ingredientes por suministro
    Ingredient.findBySupplyId = function(supplyId) {
        return this.findAll({
            where: { supply_id: supplyId },
            include: [
                { model: sequelize.models.Product, as: 'product' }
            ],
            order: [['created_at', 'ASC']]
        });
    };

    // Método para calcular el costo total del ingrediente
    Ingredient.prototype.getTotalCost = function() {
        if (this.supply && this.supply.unit_cost && this.measure_quantity) {
            return this.measure_quantity * this.supply.unit_cost;
        }
        return 0;
    };

    // Método para actualizar la cantidad de medida
    Ingredient.prototype.updateMeasureQuantity = function(newQuantity) {
        return this.update({ measure_quantity: newQuantity });
    };

    // Método para actualizar la unidad de medida
    Ingredient.prototype.updateUnitOfMeasure = function(unitOfMeasureId) {
        return this.update({ unit_of_measure_id: unitOfMeasureId });
    };

    return Ingredient;
};

export default Ingrediente;