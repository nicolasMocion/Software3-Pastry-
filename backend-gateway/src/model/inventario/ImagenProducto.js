import { DataTypes } from 'sequelize';

const ImagenProducto = (sequelize) => {
    const ProductImage = sequelize.define('product_images', {
        prod_images_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'product',
                key: 'product_id'
            },
            onDelete: 'CASCADE'
        },
        cloudinary_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        image_url: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                isUrl: true,
                notEmpty: true
            }
        },
        is_main: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        order_index: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'product_images',
        timestamps: false,
        indexes: [
            {
                fields: ['producto_id']
            },
            {
                fields: ['is_main']
            },
            {
                fields: ['order_index']
            }
        ]
    });

    ProductImage.associate = function(models) {
        // Una imagen pertenece a un producto
        ProductImage.belongsTo(models.Producto, {
            foreignKey: 'product_id',
            targetKey: 'product_id',
            as: 'product'
        });
    };

    // Metodo para encontrar imágenes por producto
    ProductImage.findByProductId = function(productId) {
        return this.findAll({
            where: { product_id: productId },
            order: [
                ['is_main', 'DESC'],
                ['order_index', 'ASC'],
                ['created_at', 'DESC']
            ]
        });
    };

    // Método para encontrar la imagen principal de un producto
    ProductImage.findMainByProductId = function(productId) {
        return this.findOne({
            where: {
                product_id: productId,
                es_principal: true
            }
        });
    };

    // Método para establecer una imagen como principal
    ProductImage.prototype.setAsMain = async function() {
        // Primero, quitar cualquier otra imagen principal del mismo producto
        await ProductImage.update(
            { es_principal: false },
            {
                where: {
                    product_id: this.product_id,
                    id: { [sequelize.Op.ne]: this.prod_images_id }
                }
            }
        );

        // Luego, establecer esta imagen como principal
        return this.update({ is_main: true });
    };

    // Metodo para actualizar el orden de la imagen
    ProductImage.prototype.updateOrder = function(newOrder) {
        return this.update({ order_index: newOrder });
    };

    return ProductImage;
};

export default ImagenProducto;