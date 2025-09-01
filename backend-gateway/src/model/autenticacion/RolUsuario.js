import  { DataTypes } from 'sequelize';

const RolUsuario = (sequelize) => {
    const RolUsuario = sequelize.define('RolUsuario', {
        rol_usuario_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        nombre_rol: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        descripcion: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'rol_usuario',
        timestamps: false
    });

    // Método para configurar asociaciones
    RolUsuario.associate = function(models) {
        // Un rol puede tener muchos usuarios
        RolUsuario.hasMany(models.Usuario, {
            foreignKey: 'rol_usuario_id',
            sourceKey: 'rol_usuario_id',
            as: 'usuarios'
        });
    };

    // Método de clase para obtener roles activos
    RolUsuario.getRolesActivos = function() {
        return this.findAll();
    };

    return RolUsuario;
};

export default RolUsuario;