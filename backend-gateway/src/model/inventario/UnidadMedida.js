import { DataTypes } from 'sequelize';

const UnidadMedida = (sequelize) => {
    const UnitOfMeasure = sequelize.define('unit_of_measure', {
        unit_of_measure_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        abbreviation: {
            type: DataTypes.STRING(5),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 5]
            }
        },
        measure_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'unit_of_measure',
        timestamps: false,
        indexes: [
            {
                fields: ['abbreviation'],
                unique: true
            },
            {
                fields: ['measure_name'],
                unique: true
            }
        ]
    });

    UnitOfMeasure.associate = function(models) {
        // Una unidad de medida puede ser usada en muchos suministros
        UnitOfMeasure.hasMany(models.Insumo, {
            foreignKey: 'unit_of_measure_id',
            sourceKey: 'unit_of_measure_id',
            as: 'supplies'
        });

        // Una unidad de medida puede ser usada en muchos movimientos de suministros
        UnitOfMeasure.hasMany(models.MovimientoInsumo, {
            foreignKey: 'unit_of_measure_id',
            sourceKey: 'unit_of_measure_id',
            as: 'supply_movements'
        });

        // Una unidad de medida puede ser usada en muchos ingredientes
        UnitOfMeasure.hasMany(models.Ingrediente, {
            foreignKey: 'unit_of_measure_id',
            sourceKey: 'unit_of_measure_id',
            as: 'ingredients'
        });
    };

    // Metodo para buscar unidades de medida por abreviatura
    UnitOfMeasure.findByAbbreviation = function(abbreviation) {
        return this.findOne({
            where: { abbreviation: abbreviation.toUpperCase() }
        });
    };

    // Metodo para buscar unidades de medida por nombre
    UnitOfMeasure.findByName = function(name) {
        return this.findAll({
            where: {
                measure_name: sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('measure_name')),
                    'LIKE',
                    `%${name.toLowerCase()}%`
                )
            }
        });
    };

    // Metodo para obtener todas las unidades de medida ordenadas
    UnitOfMeasure.getAllOrdered = function() {
        return this.findAll({
            order: [['measure_name', 'ASC']]
        });
    };

    return UnitOfMeasure;
};

export default UnidadMedida;