const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        usuario_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        nombre_completo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100]
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        contrasenia_encript: {
            type: DataTypes.STRING(300),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        telefono: {
            type: DataTypes.STRING(20),
            validate: {
                is: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
            }
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        estado_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        rol_usuario_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        tableName: 'usuario',
        timestamps: false, // Desactivamos los timestamps automáticos de Sequelize
        hooks: {
            beforeCreate: async (usuario) => {
                if (usuario.contrasenia_encript) {
                    const saltRounds = 10;
                    usuario.contrasenia_encript = await bcrypt.hash(usuario.contrasenia_encript, saltRounds);
                }
            },
            beforeUpdate: async (usuario) => {
                if (usuario.changed('contrasenia_encript')) {
                    const saltRounds = 10;
                    usuario.contrasenia_encript = await bcrypt.hash(usuario.contrasenia_encript, saltRounds);
                }
            }
        }
    });

    // Método para configurar asociaciones
    Usuario.associate = function(models) {
        // Un usuario pertenece a un rol
        Usuario.belongsTo(models.RolUsuario, {
            foreignKey: 'rol_usuario_id',
            targetKey: 'rol_usuario_id',
            as: 'rol'
        });

        // Un usuario pertenece a un estado
        Usuario.belongsTo(models.Estado, {
            foreignKey: 'estado_id',
            targetKey: 'estado_id',
            as: 'estado'
        });

        // Un usuario puede tener muchos tokens de restablecimiento
        Usuario.hasMany(models.TokenRestablecimiento, {
            foreignKey: 'usuario_id',
            sourceKey: 'usuario_id',
            as: 'tokensRestablecimiento'
        });

        // Un usuario puede ser repartidor en muchos pedidos
        Usuario.hasMany(models.Pedido, {
            foreignKey: 'repartidor_id',
            sourceKey: 'usuario_id',
            as: 'pedidosRepartidor'
        });

        // Un usuario puede tener muchos pedidos como cliente
        Usuario.hasMany(models.Pedido, {
            foreignKey: 'usuario_id',
            sourceKey: 'usuario_id',
            as: 'pedidosCliente'
        });

        // Un usuario puede crear muchos seguimientos de pedidos
        Usuario.hasMany(models.SeguimientoPedido, {
            foreignKey: 'usuario_id',
            sourceKey: 'usuario_id',
            as: 'seguimientos'
        });
    };


    // Método para verificar contraseña
    Usuario.prototype.validarContrasenia = async function(contrasenia) {
        return await bcrypt.compare(contrasenia, this.contrasenia_encript);
    };

    // Método para ocultar la contraseña en las respuestas
    Usuario.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        delete values.contrasenia_encript;
        return values;
    };

    return Usuario;
};