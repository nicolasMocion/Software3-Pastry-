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

    // Metodo de clase para obtener estado active de usuario
    Estado.getEstadoActivoUsuario = function() {
        return this.findOne({
            where: {
                entity: 'usuario',
                name: 'active'
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

    //metodo para obtener id de un estado segun la entidad y el nombre del estado
    Estado.getIdEstadoByEntityAndName = async function(entity, name) {
        const estado = await this.findOne({
            where: {
                entity: entity,
                name: name
            },
            raw:true});
        return  estado.status_id;
    };

    return Estado;
};

export default Estado;