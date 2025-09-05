import { DataTypes } from 'sequelize';

const Producto = (sequelize) => {
    const Product = sequelize.define('Product', {
        product_id: {
            type: DataTypes.UUID,
            //automaticamente se crea un UUID
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        product_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100]
            }
        },
        current_stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        critical_stock: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
            validate: {
                min: 0
            }
        },
        description: {
            type: DataTypes.TEXT,
            validate: {
                len: [0, 1000]
            }
        },
        unit_price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        preparation_time_min: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        customizable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        product_category_id: {
            type: DataTypes.STRING(50)
        },
        status_id: {
            type: DataTypes.STRING(50),
            defaultValue: 'est_prod_act'
        }
    }, {
        tableName: 'product',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['product_name']
            },
            {
                fields: ['product_category_id']
            },
            {
                fields: ['status_id']
            },
            {
                fields: ['current_stock']
            }
        ]
    });

    // Metodo para configurar asociaciones
    Product.associate = function(models) {
        // Un producto pertenece a una categoría
        Product.belongsTo(models.CategoriaProducto, {
            foreignKey: 'product_category_id',
            targetKey: 'product_category_id',
            as: 'categoria'
        });
/*
        // Un producto puede tener muchos ingredientes
        Product.hasMany(models.Ingrediente, {
            foreignKey: 'product_id',
            sourceKey: 'product_id',
            as: 'ingredientes'
        });

        // Un producto puede estar en muchos detalles de pedido
        Product.hasMany(models.DetallePedido, {
            foreignKey: 'product_id',
            sourceKey: 'product_id',
            as: 'detallesPedido'
        });

        // Un producto puede tener muchos movimientos de stock
        Product.hasMany(models.MovimientoProducto, {
            foreignKey: 'product_id',
            sourceKey: 'product_id',
            as: 'movimientos'
        });

        // Un producto puede tener alertas de stock
        Product.hasMany(models.AlertStockProducto, {
            foreignKey: 'product_id',
            sourceKey: 'product_id',
            as: 'alertasStock'
        });

        // Un producto puede estar en muchos catálogos
        Product.hasMany(models.Catalogo, {
            foreignKey: 'product_id',
            sourceKey: 'product_id',
            as: 'catalogos'
        });

 */
    };

    // Métodos de instancia
    Product.prototype.estaDisponible = function() {
        return this.current_stock > 0 && this.status_id === 'active';
    };

    Product.prototype.necesitaReposicion = function() {
        return this.current_stock <= this.critical_stock;
    };

    Product.prototype.actualizarStock = function(cantidad, tipoMovimiento) {
        if (tipoMovimiento === 'entrada') {
            this.current_stock += cantidad;
        } else if (tipoMovimiento === 'salida') {
            this.current_stock = Math.max(0, this.current_stock - cantidad);
        }
        return this.save();
    };

    Product.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        return values;
    };

    // Métodos de clase (estáticos)
    Product.findByCategoria = function(categoriaId) {
        return this.findAll({
            where: { product_category_id: categoriaId },
            include: [{ model: this.sequelize.models.CategoriaProducto, as: 'categoria' }]
        });
    };

    Product.findByNombre = function(nombre) {
        return this.findOne({
            where: { product_name: nombre },
            include: [{ model: this.sequelize.models.CategoriaProducto, as: 'categoria' }]
        });
    };

    Product.findProductosBajoStock = function() {
        return this.findAll({
            where: this.sequelize.literal('current_stock <= critical_stock'),
            include: [{ model: this.sequelize.models.CategoriaProducto, as: 'categoria' }]
        });
    };

    Product.findProductosActivos = function() {
        return this.findAll({
            where: { status_id: 'active' },
            include: [{ model: this.sequelize.models.CategoriaProducto, as: 'categoria' }]
        });
    };

    return Product;
};

export  default  Producto;