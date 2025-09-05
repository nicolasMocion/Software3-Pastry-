import { DataTypes } from 'sequelize';

const MovimientoProducto = (sequelize) => {
    const ProductMovement = sequelize.define('ProductMovement', {
        product_movement_id: {
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
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        }
    }, {
        tableName: 'product_movement',
        timestamps: false,
        indexes: [
            {
                fields: ['product_id']
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

    ProductMovement.associate = function(models) {
        // Un movimiento de producto pertenece a un producto
        ProductMovement.belongsTo(models.Producto, {
            foreignKey: 'product_id',
            targetKey: 'product_id',
            as: 'product'
        });

        // Un movimiento de producto puede estar relacionado con una alerta de stock
        ProductMovement.hasOne(models.AlertaStockProducto, {
            foreignKey: 'product_movement_id',
            sourceKey: 'product_movement_id',
            as: 'stock_alert'
        });
    };

    // Metodo para encontrar movimientos por producto
    ProductMovement.findByProductId = function(productId) {
        return this.findAll({
            where: { product_id: productId },
            include: [{ all: true }],
            order: [['created_at', 'DESC']]
        });
    };

    // Metodo para encontrar movimientos por tipo
    ProductMovement.findByMovementType = function(movementTypeId) {
        return this.findAll({
            where: { movement_type_id: movementTypeId },
            include: [{ all: true }],
            order: [['created_at', 'DESC']]
        });
    };

    // Metodo para encontrar movimientos por usuario
    ProductMovement.findByUserId = function(userId) {
        return this.findAll({
            where: { user_id: userId },
            include: [{ all: true }],
            order: [['created_at', 'DESC']]
        });
    };

    // Metodo para encontrar movimientos en un rango de fechas
    ProductMovement.findByDateRange = function(startDate, endDate) {
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

    // Metodo para aplicar el movimiento al stock del producto
    ProductMovement.prototype.applyToStock = async function() {
        const movementType = await sequelize.models.MovementType.findByPk(this.movement_type_id);

        if (movementType && movementType.affects_stock) {
            const product = await sequelize.models.Product.findByPk(this.product_id);
            if (product) {
                const stockChange = movementType.movement_sign * this.quantity;
                await product.update({ current_stock: product.current_stock + stockChange });
            }
        }
    };

    // Metodo para obtener el signo del movimiento (positivo o negativo)
    ProductMovement.prototype.getMovementSign = async function() {
        const movementType = await sequelize.models.MovementType.findByPk(this.movement_type_id);
        return movementType ? movementType.movement_sign : 0;
    };

    return ProductMovement;
};

export default MovimientoProducto;