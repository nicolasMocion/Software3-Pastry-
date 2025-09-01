import {DataTypes } from 'sequelize';

const CategoriaProducto = (sequelize) => {
    const product_category = sequelize.define('product_category', {
        product_category_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        category_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100]
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'product_category',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['category_name']
            }
        ]
    });

    // Metodo para configurar asociaciones
    product_category.associate = function(models) {
        // Una categoría puede tener muchos productos
        product_category.hasMany(models.Producto, {
            foreignKey: 'product_category_id',
            sourceKey: 'product_category_id',
            as: 'productos'
        });
    };

    // Metodos de instancia
    product_category.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        return values;
    };

    // Métodos de clase
    product_category.findByNombre = function(nombre) {
        return this.findOne({ where: { category_name: nombre } });
    };

    product_category.getCategoriasActivas = function() {
        return this.findAll({
            include: [{
                model: this.sequelize.models.Producto,
                as: 'productos',
                where: { status_id: 'activo' },
                required: false
            }]
        });
    };

    return product_category;
};

export default CategoriaProducto;