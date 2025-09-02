import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const Usuario = (sequelize) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.UUID,
            //automaticamente se crea un UUID
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        full_name: {
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
        encrypted_password: {
            type: DataTypes.STRING(300),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            validate: {
                is: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        user_role_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        tableName: 'user',
        timestamps: false, // Desactivamos los timestamps automáticos de Sequelize
        hooks: {
            //encriptacion de la contraseña
            beforeCreate: async (usuario) => {
                if (usuario.encrypted_password) {
                    const saltRounds = 10;
                    usuario.encrypted_password = await bcrypt.hash(usuario.encrypted_password, saltRounds);
                }
            },
            beforeUpdate: async (usuario) => {
                if (usuario.changed('encrypted_password')) {
                    const saltRounds = 10;
                    usuario.encrypted_password = await bcrypt.hash(usuario.encrypted_password, saltRounds);
                }
            }
        }
    });

    // Metodo para configurar asociaciones
    User.associate = function(models) {
        // Un usuario pertenece a un rol
        User.belongsTo(models.RolUsuario, {
            foreignKey: 'user_role_id',
            targetKey: 'user_role_id',
            as: 'rol'
        });

        // Un usuario puede tener muchos tokens de restablecimiento
        User.hasMany(models.TokenRestablecimiento, {
            foreignKey: 'user_id',
            sourceKey: 'user_id',
            as: 'tokensRestablecimiento'
        });

    };

    // Metodo para verificar contraseña
    User.prototype.validarContrasenia = async function(contrasenia) {
        return await bcrypt.compare(contrasenia, this.encrypted_password);
    };


    // Metodo para ocultar la contraseña en las respuestas
    User.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        delete values.encrypted_password;
        return values;
    };

    return User;
};

export default Usuario;