import DataTypes from 'sequelize';

const Estado = (sequelize) => {
    const Estado = sequelize.define('status', {
        status_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        entity: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'status',
        timestamps: false,
        indexes: [
            {
                fields: ['entity']
            }
        ]
    });

    // Metodo para configurar asociaciones
    Estado.associate = function(models) {

    };

    // Metodo de clase para obtener estados por entidad
    Estado.findByEntity = function(entidad) {
        return this.findAll({ where: { entidad } });
    };

    // Metodo de clase para obtener estado activo de usuario
    Estado.getEstadoActivoUsuario = function() {
        return this.findOne({
            where: {
                entity: 'usuario',
                name: 'activo'
            }
        });
    };

    // Metodo de clase para obtener estado inactivo de usuario
    Estado.getEstadoInactivoUsuario = function() {
        return this.findOne({
            where: {
                entity: 'usuario',
                name: 'inactivo'
            }
        });
    };

    return Estado;
};

export default Estado;