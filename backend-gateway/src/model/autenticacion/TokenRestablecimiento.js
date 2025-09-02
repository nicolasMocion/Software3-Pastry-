import { DataTypes } from 'sequelize';

const TokenRestablecimiento = (sequelize) => {
    const reset_token = sequelize.define('reset_token', {
        token_reset_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(300),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        expiration_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'reset_token',
        timestamps: false,
        indexes: [
            {
                fields: ['token']
            },
            {
                fields: ['user_id']
            }
        ]
    });

    // Método para configurar asociaciones
    reset_token.associate = function(models) {
        // Un token pertenece a un usuario
        reset_token.belongsTo(models.Usuario, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            as: 'usuario'
        });
    };

    // Método para verificar si el token es válido
    reset_token.prototype.esValido = function() {
        return this.active && !this.used && new Date() < this.expiration_date;
    };

    // Método para invalidar token
    reset_token.prototype.invalidar = function() {
        this.active = false;
        this.used = true;
        return this.save();
    };

    // Método de clase para buscar token active por usuario
    reset_token.findActivoByUsuario = function(usuarioId) {
        return this.findOne({
            where: {
                user_id: usuarioId,
                active: true,
                used: false,
                expiration_date: { [Op.gt]: new Date() }
            }
        });
    };

    return reset_token;
};

export default TokenRestablecimiento;