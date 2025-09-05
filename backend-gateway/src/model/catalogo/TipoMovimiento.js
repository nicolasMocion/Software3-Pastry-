import { DataTypes } from 'sequelize';

const TipoMovimiento = (sequelize) => {
    const MovementType = sequelize.define('MovementType', {
        movement_type_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        movement_type_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        movement_sign: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, -1]] // Solo permite 1 (entrada) o -1 (salida)
            }
        },
        affects_stock: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'movement_type',
        timestamps: false,
        indexes: [
            {
                fields: ['movement_type_name']
            },
            {
                fields: ['movement_sign']
            },
            {
                fields: ['affects_stock']
            }
        ]
    });

    MovementType.associate = function(models) {

    };

    // Método para encontrar tipos de movimiento por signo
    MovementType.findBySign = function(sign) {
        return this.findAll({
            where: { movement_sign: sign },
            order: [['movement_type_name', 'ASC']]
        });
    };

    // Método para encontrar tipos de movimiento que afectan el stock
    MovementType.findStockAffecting = function() {
        return this.findAll({
            where: { affects_stock: true },
            order: [['movement_type_name', 'ASC']]
        });
    };

    // Método para verificar si es un movimiento de entrada
    MovementType.prototype.isIncoming = function() {
        return this.movement_sign === 1;
    };

    // Método para verificar si es un movimiento de salida
    MovementType.prototype.isOutgoing = function() {
        return this.movement_sign === -1;
    };

    return MovementType;
};

export default TipoMovimiento;