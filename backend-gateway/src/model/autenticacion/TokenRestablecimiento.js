const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TokenRestablecimiento = sequelize.define('TokenRestablecimiento', {
        token_reset_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        usuario_id: {
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
        utilizado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fecha_expiracion: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'token_restablecimiento',
        timestamps: false,
        indexes: [
            {
                fields: ['token']
            },
            {
                fields: ['usuario_id']
            }
        ]
    });

    // Método para configurar asociaciones
    TokenRestablecimiento.associate = function(models) {
        // Un token pertenece a un usuario
        TokenRestablecimiento.belongsTo(models.Usuario, {
            foreignKey: 'usuario_id',
            targetKey: 'usuario_id',
            as: 'usuario'
        });
    };

    // Método para verificar si el token es válido
    TokenRestablecimiento.prototype.esValido = function() {
        return this.activo && !this.utilizado && new Date() < this.fecha_expiracion;
    };

    // Método para invalidar token
    TokenRestablecimiento.prototype.invalidar = function() {
        this.activo = false;
        this.utilizado = true;
        return this.save();
    };

    // Método de clase para buscar token activo por usuario
    TokenRestablecimiento.findActivoByUsuario = function(usuarioId) {
        return this.findOne({
            where: {
                usuario_id: usuarioId,
                activo: true,
                utilizado: false,
                fecha_expiracion: { [Op.gt]: new Date() }
            }
        });
    };

    return TokenRestablecimiento;
};