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
            allowNull: false,
            defaultValue: 'est_user_act'
        },
        user_role_id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: 'rol_cliente'
        },
        cc : {
            type: DataTypes.STRING(100),
            allowNull: true,

        },
        auth0_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'user',
        timestamps: false, // Desactivamos los timestamps automáticos de Sequelize
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

    // Metodo para ocultar la contraseña en las respuestas
    User.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());
        delete values.encrypted_password;
        return values;
    };

    // Metodo para encontrar usuario por el id de Auth0
    User.findByAuth0Id = function(auth0Id) {
        return this.findOne({ where: { auth0_id: auth0Id } });
    };

    //Metodo para encontrar usuario por email
    User.findByEmail = function(email) {
        return this.findOne({ where: { email } });
    };

    return User;
};

export default Usuario;