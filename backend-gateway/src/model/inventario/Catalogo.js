import { DataTypes } from 'sequelize';

const Catalogo = (sequelize) => {
    const Catalog = sequelize.define('catalog', {
        catalog_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        menu_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'menu',
                key: 'menu_id'
            }
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'product',
                key: 'product_id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0
            }
        },
        customization_cost: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            validate: {
                min: 0
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'catalog',
        timestamps: false,
        indexes: [
            {
                fields: ['menu_id']
            },
            {
                fields: ['product_id']
            },
            {
                fields: ['available']
            }
        ]
    });

    Catalog.associate = function(models) {
        // Un item del catálogo pertenece a un menú
        Catalog.belongsTo(models.Menu, {
            foreignKey: 'menu_id',
            targetKey: 'menu_id',
            as: 'menu'
        });

        // Un item del catálogo pertenece a un producto
        Catalog.belongsTo(models.Producto, {
            foreignKey: 'product_id',
            targetKey: 'product_id',
            as: 'product'
        });
    };

    // Método para encontrar items del catálogo por menú
    Catalog.findByMenuId = function(menuId) {
        return this.findAll({
            where: { menu_id: menuId },
            include: [{ all: true }],
            order: [['created_at', 'ASC']]
        });
    };

    // Método para encontrar items disponibles en un menú
    Catalog.findAvailableByMenuId = function(menuId) {
        return this.findAll({
            where: {
                menu_id: menuId,
                available: true
            },
            include: [{ all: true }],
            order: [['created_at', 'ASC']]
        });
    };

    // Método para encontrar items del catálogo por producto
    Catalog.findByProductId = function(productId) {
        return this.findAll({
            where: { product_id: productId },
            include: [{ all: true }],
            order: [['created_at', 'DESC']]
        });
    };

    // Método para activar/desactivar un item del catálogo
    Catalog.prototype.setAvailability = function(isAvailable) {
        return this.update({ available: isAvailable });
    };

    // Método para actualizar el costo de personalización
    Catalog.prototype.updateCustomizationCost = function(newCost) {
        return this.update({ customization_cost: newCost });
    };

    // Método para actualizar la cantidad disponible
    Catalog.prototype.updateQuantity = function(newQuantity) {
        return this.update({ quantity: newQuantity });
    };

    return Catalog;
};

export default Catalogo;